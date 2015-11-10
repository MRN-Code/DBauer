'use strict';

var path = require('path');
var spawnSync = require('child_process').spawnSync;
var credentials = require(path.join(__dirname, 'get-connection-info.js'))();
var dumpFilePath = path.resolve(path.join(process.cwd(), 'tmp', 'pg_dump_output'));
var tempDBName = 'temp_dev_db';
var dumpCmd = '/usr/bin/pg_dump';
var dumpArgs = [
    '--schema-only',
    '--username=' + credentials.username,
    '--no-password',
    '--host=' + credentials.host,
    '--format=custom',
    '--file=' + dumpFilePath,
    credentials.db
];

var restoreCmd = '/usr/bin/pg_restore';

var restoreArgs = [
    '--clean',
    '--create',
    '--schema-only',
    '--exit-on-error',
    '--username=' + credentials.username,
    '--host=' + credentials.host,
    '--jobs=4',
    '--no-password',
    '--dbname=' + tempDBName,
    dumpFilePath,
];

var environment = {
    PGPASSWORD: credentials.password
};

module.exports = function copySchema() {
    var dumpResult;
    var restoreResult;
    console.log('dumping database schema');
    dumpResult = spawnSync(dumpCmd, dumpArgs, {
        timeout: 30 * 60 * 1000, // 30 minutes
        env: environment
    });

    if (dumpResult.status !== 0) {
        console.dir(dumpResult);
        throw new Error('Encountered error dumping database:');
    } else {
        console.log('schema dump complete');
    }

    console.log('creating new db from dumped schema');
    restoreResult = spawnSync(restoreCmd, restoreArgs, {
        timeout: 30 * 60 * 1000, // 30 minutes
        env: environment
    });

    if (restoreResult.status !== 0) {
        console.dir(restoreResult);
        throw new Error('Encountered error restoring database:');
    } else {
        console.log('database creation complete');
    }
};
