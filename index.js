'use strict';
var path = require('path');
var getConnInfo = require(path.join(__dirname, 'lib/get-connection-info.js'));
var connectionInfo = getConnInfo();
connectionInfo.database = connectionInfo.db;
connectionInfo.user = connectionInfo.username;
var knex = require('knex')({
    client: 'pg',
    connection: connectionInfo
});

var copySchema = require(path.join(__dirname, 'lib/copy-schema.js'));
copySchema();

knex('cas_sites').select()
    .then(function(data) {
        console.log(data);
    });
