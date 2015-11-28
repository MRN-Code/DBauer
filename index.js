'use strict';
var path = require('path');
var dbUtils = require(path.join(__dirname, 'lib/db-utils.js'));
var s3Utils = require(path.join(__dirname, 'lib/s3-utils.js'));

var getConnInfo = require(path.join(__dirname, 'lib/get-connection-info.js'));
var connectionInfo = getConnInfo();
var copyData = require(path.join(__dirname, 'lib/copy-seed-data.js'));

function closeShop() {
    process.exit(0);
}

dbUtils.init(connectionInfo);
dbUtils.copySchema();
copyData(connectionInfo)
    .then(dbUtils.dumpTempDb)
    .then(s3Utils.upload)
    .then(dbUtils.dropTempDb)
    .then(closeShop)
    .catch(function(err) {
        console.log('Error during upload or dropTempDb');
        console.dir(err);
    });
