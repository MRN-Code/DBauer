'use strict';
var path = require('path');
var dbUtils = require(path.join(__dirname, 'lib/db-utils.js'));

var getConnInfo = require(path.join(__dirname, 'lib/get-connection-info.js'));
var connectionInfo = getConnInfo();
    
dbUtils.init(connectionInfo);
dbUtils.copySchema();
var copyData = require(path.join(__dirname, 'lib/copy-seed-data.js'));
copyData(connectionInfo)
    .then(function() {
        //dbUtils.dumpDb(tempDbName, config.get('destPath'));
        //dbUtils.dropTempDb(tempDbName);
        process.exit(0);
    });
