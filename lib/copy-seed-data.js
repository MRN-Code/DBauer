'use strict';

var config = require('config');
var _ = require('lodash');
var seedSiteId = config.get('seedDataConfig.seedSiteId');
var seedStudyId = config.get('seedDataConfig.seedStudyId');
var knexFactory = require('knex');
var destKnex;

function getTableName(knexQuery) {
    return knexQuery._single.table;
}

function insertRows(tableName, rows) {
    console.log('Inserting seed data to ', tableName);
    return Promise.all(rows.map(function insertRow(row) {
        return destKnex(tableName).insert(row)
            .then(function() {
                console.log('Finished inserting seed data to ', tableName);
            });
    }));
}

function cleanTableThenInsert(tableName, rows) {
    console.log('Deleting all rows from ', tableName);
    return destKnex(tableName).delete()
        .then(_.noop)
        .then(_.partial(insertRows, tableName, rows));
}

function executeQuery(knexQuery) {
    var tableName = getTableName(knexQuery);
    console.log('Selecting seed data from ', tableName);
    return knexQuery.then(_.partial(cleanTableThenInsert, tableName));
}

function initAllRowsSeedQueries(knex) {
    return config.get('seedDataConfig.allRows').map(function(tableName) {
        return knex(tableName);
    });
}

function initSiteIdSeedQueries(knex) {
    return config.get('seedDataConfig.rowsBySiteId').map(function(tableName) {
        return knex(tableName).where('site_id', seedSiteId);
    });
}

function initStudyIdSeedQueries(knex) {
    return config.get('seedDataConfig.rowsByStudyId').map(function(tableName) {
        return knex(tableName).where('study_id', seedStudyId);
    });
}

/**
 * build a multi-Table query to retrieve seed data
 * @param  {object} knex        knex client object
 * @param  {object} queryConfig object containing the following properties
 *                              * tableName {string} the table to select from
 *                              * joins {array} is an array of tables to join to
 *                              each array element is an object with props:
 *                              	* tableName {string} table to join to
 *                              	* columnName {string} column to join on
 *                               * where {many} is a string that equals 'study'
 *                               or 'site', or an array of join criteria
 * @return {object}             a knex query building object
 */
function buildMultiTableSeedQuery(knex, queryConfig) {
    var tableName = queryConfig.tableName;
    var query = knex(tableName).distinct(tableName + '.*');
    var previousJoinTableName = tableName;
    queryConfig.joins.forEach(function addInnerJoin(joinConfig) {
        var joinTableName = joinConfig.tableName;
        var joinColumn = joinConfig.columnName;
        query.innerJoin(
            joinTableName,
            joinTableName + '.' + joinColumn,
            previousJoinTableName + '.' + joinColumn
        );
        previousJoinTableName = joinTableName;
    });

    if (queryConfig.where === 'study') {
        query.where('study_id', seedStudyId);
    } else if (queryConfig.where === 'site') {
        query.where('site_id', seedSiteId);
    } else if (_.isArray(queryConfig.where)) {
        query.apply(query, queryConfig.where);
    } else {
        throw new Error('Unknown `where` prop in multiTable for ' + tableName);
    }

    return query;
}

function initMultiTableSeedQueries(knex) {
    return config.get('seedDataConfig.rowsFromMultiTable')
        .map(_.partial(buildMultiTableSeedQuery, knex));
}

function setTriggers(knex, tables, enable) {
    var state = enable ? 'ENABLE' : 'DISABLE';
    var query = 'ALTER TABLE ? ' + state + ' TRIGGER ALL;';
    console.log(state.toLowerCase() + 'ing triggers');
    var queries = tables.map(function getTriggerQuery(tableName) {
        return knex.raw(query.replace('?', tableName)).then(_.noop);
    });

    return Promise.all(queries)
        .then(function() {
            console.log('Finished ' + state.toLowerCase() + 'ing all triggers');
        });
}

function init(credentials) {
    var srcConnectionConfig = _.cloneDeep(credentials);
    srcConnectionConfig.database = credentials.db;
    srcConnectionConfig.user = credentials.username;
    var destConnectionConfig = _.cloneDeep(srcConnectionConfig);
    destConnectionConfig.database = config.get('tempDbName');
    var srcKnex = knexFactory({
        client: 'pg',
        connection: srcConnectionConfig
    });
    destKnex = knexFactory({
        client: 'pg',
        connection: destConnectionConfig
    });
    var knexQueries = initAllRowsSeedQueries(srcKnex)
        .concat(initSiteIdSeedQueries(srcKnex))
        .concat(initStudyIdSeedQueries(srcKnex))
        .concat(initMultiTableSeedQueries(srcKnex));
    var affectedTables = knexQueries.map(getTableName);

    var copyData = function() {
        var knexPromises = knexQueries.map(executeQuery);

        return Promise.all(knexPromises)
            .then(function allDone() {
                console.log('all done');
            });
    };

    var reinstateTriggers = function() {
        return setTriggers(destKnex, affectedTables, true);
    };

    setTriggers(destKnex, affectedTables, false)
        .then(copyData)
        .then(reinstateTriggers)
        .catch(function(error) {
            console.log('Encountered error copying seed data');
            console.log(error.stack);
            process.exit(1);
        });
}

module.exports = init;
