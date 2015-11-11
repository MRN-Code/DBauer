'use strict';

var path = require('path');
var spawnSync = require('child_process').spawnSync;

//script currently uses connects as the postgres user from localhost, so no
//credentials are necessary
//var credentials = require(path.join(__dirname, 'get-connection-info.js'))();
var credentials = {};
var credentialArgs = [];
var environment = {};
if (credentials.password) {
    environment.PGPASSWORD = credentials.password;
}

if (credentials.username) {
    credentialArgs.push('--username=' + credentials.username);
}

if (credentials.host) {
    credentialArgs.push('--host=' + credentials.host);
}

var dumpFilePath = path.join(process.cwd(), 'tmp', 'pg_dump_output');
var tempDbName = 'temp_dev_db';
var dumpCmd = '/usr/bin/pg_dump';
var dumpArgs = [
    '--schema-only',
    '--no-password',
    '--format=custom',
    '--file=' + dumpFilePath
].concat(credentialArgs).concat([credentials.db || 'coins']);

var restoreCmd = '/usr/bin/pg_restore';

var restoreArgs = [
    '--schema-only',
    '--exit-on-error',
    '--jobs=4',
    '--no-password',
    '--dbname=' + tempDbName
].concat(credentialArgs).concat([dumpFilePath]);

var createCmd = '/usr/bin/createdb';
var createArgs = [
    '-T',
    'template0',
    tempDbName
];

var dropCmd = '/usr/bin/dropdb';
var dropArgs = [
    tempDbName
];

module.exports = function copySchema() {
    var dumpResult;
    var restoreResult;
    var dropResult;
    var createResult;
    console.log('dumping database schema');
    dumpResult = spawnSync(dumpCmd, dumpArgs, {
        timeout: 30 * 60 * 1000, // 30 minutes
        env: environment
    });

    if (dumpResult.status !== 0) {
        console.dir(dumpResult);
        console.log(dumpResult.stderr.toString());
        console.log(dumpResult.stdout.toString());
        throw new Error('Encountered error dumping database^');
    } else {
        console.log('schema dump complete');
    }

    console.log('dropping new temp db if it exists: ', tempDbName);
    dropResult = spawnSync(dropCmd, dropArgs, {
        timeout: 30 * 60 * 1000, // 30 minutes
        env: environment
    });

    console.log('creating new temp db: ', tempDbName);
    createResult = spawnSync(createCmd, createArgs, {
        timeout: 30 * 60 * 1000, // 30 minutes
        env: environment
    });

    console.log('creating new db from dumped schema');
    restoreResult = spawnSync(restoreCmd, restoreArgs, {
        timeout: 30 * 60 * 1000, // 30 minutes
        env: environment
    });

    if (restoreResult.status !== 0) {
        console.dir(restoreResult);
        console.log(restoreResult.stderr.toString());
        console.log(restoreResult.stdout.toString());
        throw new Error('Encountered error restoring database:');
    } else {
        console.log('database creation complete');
    }
};
