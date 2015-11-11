'use strict';

var config = require('config');
var os = require('os');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

//global variables set by initCredentials
var credentials = {};
var credentialArgs = [];
var environment = {};
var dumpFilePath = path.join(process.cwd(), 'tmp', 'pg_dump_output');

/**
 * initialize global credentials objects
 * @param  {object} credentials database connection credentials
 * @return {null}
 */
function initCredentials(credentials) {
    if (credentials.password) {
        environment.PGPASSWORD = credentials.password;
    }

    if (credentials.username) {
        credentialArgs.push('--username=' + credentials.username);
    }

    if (credentials.port) {
        credentialArgs.push('--port=' + credentials.port);
    }

    if (credentials.host) {
        credentialArgs.push('--host=' + credentials.host);
    }
}

/**
 * spawn child process to execute given command. Exits on error in child process
 * @param  {string} cmd             command to be executed
 * @param  {array} args             array of arguments
 * @param  {boolean} ignoreErrors   do not exit on error (defaults to false)
 * @return {object}                 child_process spawnSync result obj
 */
function spawnCmd(cmd, args, ignoreErrors) {
    var result = spawnSync(cmd, args, {
        timeout: 30 * 60 * 1000, // 30 minutes
        env: environment
    });
    if (result.status !== 0) {
        var stderr = result.stderr || new Buffer();
        var stdout = result.stdout || new Buffer();
        var errorMsg = [
            'Encountered error executing command ' + cmd,
            'process status code: ' + result.status,
            'error: ' + result.error,
            'stderr: ' + stderr.toString(),
            'stdout: ' + stdout.toString()
        ].join(os.EOL);
        console.log(errorMsg);
        if (ignoreErrors) {
            console.log('Ignoring errors');
        } else {
            process.exit(result.status);
        }
    }

    return result;
}

/**
 * dump database schema to file
 * @return {object} child_process spawnSync result obj
 */
function dumpSchema() {
    var sourceDbName = credentials.db || config.get('srcDbName');
    var cmd = '/usr/bin/pg_dump';
    var args = [
        '--schema-only',
        '--no-password',
        '--format=custom',
        '--file=' + dumpFilePath
    ].concat(credentialArgs).concat([sourceDbName]);
    console.log('dumping database schema');
    return spawnCmd(cmd, args);
}

/**
 * dump database schema and data to file
 * @return {object} child_process spawnSync result obj
 */
function dumpDb(dbName, dest) {
    var cmd = '/usr/bin/pg_dump';
    var args = [
        '--no-password',
        '--format=custom',
        '--file=' + dest
    ].concat(credentialArgs).concat([dbName]);
    console.log('dumping database to ' + dest);
    return spawnCmd(cmd, args);
}

/**
 * drop temporary database that schema will be loaded into
 * @param  {string} tempDbName name of db to be dropped
 * @return {object} child_process spawnSync result obj
 */
function dropTempDb(tempDbName) {
    var cmd = '/usr/bin/dropdb';
    var args = credentialArgs.concat([tempDbName]);
    console.log('dropping new temp db if it exists: ', tempDbName);
    return spawnCmd(cmd, args, true);
}

/**
 * create temporary database that schema will be loaded into
 * @param  {string} tempDbName name of db to be created
 * @return {object} child_process spawnSync result obj
 */
function createTempDb(tempDbName) {
    var cmd = '/usr/bin/createdb';
    var args = [
        '-T',
        'template0',
    ].concat(credentialArgs).concat([tempDbName]);
    console.log('creating new temp db: ', tempDbName);
    return spawnCmd(cmd, args, true);
}

function setSearchPath(tempDbName) {
    var searchPath = config.get('schemaSearchPath');
    var cmd = '/usr/bin/psql';
    var args = [
        '-c',
        'ALTER DATABASE ' + tempDbName + ' SET SEARCH_PATH = ' + searchPath,
        '--dbname=' + tempDbName
    ].concat(credentialArgs).concat([tempDbName]);
    console.log('Setting search path for ', tempDbName);
    return spawnCmd(cmd, args, true);
}

/**
 * restore dumped schema to temporary database
 * @param  {string} tempDbName name of db to load schema into
 * @return {object} child_process spawnSync result obj
 */
function buildSchema(tempDbName) {
    var cmd = '/usr/bin/pg_restore';
    var args = [
        '--schema-only',
        '--exit-on-error',
        '--jobs=4',
        '--no-password',
        '--dbname=' + tempDbName
    ].concat(credentialArgs).concat([dumpFilePath]);
    console.log('building schema in new temp db');
    return spawnCmd(cmd, args);
}

/**
 * copy schema from credentials.db to dbName
 * @param  {string} dbName      name of destination db
 * @param  {object} credentials database connection params
 * @return {null}
 */
module.exports.init = initCredentials;
module.exports.dropTempDb = dropTempDb;
module.exports.copySchema = function copySchema(dbName) {
    dumpSchema();
    dropTempDb(dbName);
    createTempDb(dbName);
    buildSchema(dbName);
    setSearchPath(dbName);
    console.log('database creation complete');
};

module.exports.dumpDb = dumpDb;
