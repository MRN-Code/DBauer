'use strict';

var path = require('path');
var os = require('os');
var spawnSync = require('child_process').spawnSync;

//script currently uses connects as the postgres user from localhost, so no
//credentials are necessary
//var credentials = require(path.join(__dirname, 'get-connection-info.js'))();
var credentials = {};
var credentialArgs = [];
var environment = {};
var dumpFilePath = path.join(process.cwd(), 'tmp', 'pg_dump_output');
if (credentials.password) {
    environment.PGPASSWORD = credentials.password;
}

if (credentials.username) {
    credentialArgs.push('--username=' + credentials.username);
}

if (credentials.host) {
    credentialArgs.push('--host=' + credentials.host);
}

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

function dumpSchema(){
    var cmd = '/usr/bin/pg_dump';
    var args = [
        '--schema-only',
        '--no-password',
        '--format=custom',
        '--file=' + dumpFilePath
    ].concat(credentialArgs).concat([credentials.db || 'coins']);
    console.log('dumping database schema');
    return spawnCmd(cmd, args);
}

function dropTempDb(tempDbName) {
    var cmd = '/usr/bin/dropdb';
    var args = credentialArgs.concat([tempDbName]);
    console.log('dropping new temp db if it exists: ', tempDbName);
    return spawnCmd(cmd, args, true);
}

function createTempDb(tempDbName) {
    var cmd = '/usr/bin/createdb';
    var args = [
        '-T',
        'template0',
    ].concat(credentialArgs).concat([tempDbName]);
    console.log('creating new temp db: ', tempDbName);
    return spawnCmd(cmd, args, true);
}

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

module.exports = function copySchema(dbName) {
    dumpSchema();
    dropTempDb(dbName);
    createTempDb(dbName);
    buildSchema(dbName);
    console.log('database creation complete');
};
