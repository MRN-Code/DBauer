'use strict';
var path = require('path');
var dbUtils = require(path.join(__dirname, 'lib/db-utils.js'));
var s3Utils = require(path.join(__dirname, 'lib/s3-utils.js'));

var getConnInfo = require(path.join(__dirname, 'lib/get-connection-info.js'));
var connectionInfo = getConnInfo();

dbUtils.init(connectionInfo);
dbUtils.copySchema();
var copyData = require(path.join(__dirname, 'lib/copy-seed-data.js'));
copyData(connectionInfo)
    .then(function() {
        dbUtils.dumpDb();
        return s3Utils.upload()
            .then(function() {
                dbUtils.dropTempDb();
                process.exit(0);
            })
            .catch(function(err) {
                console.log('Error during upload or dropTempDb');
                console.dir(err);
            });
    });
