'use strict';
var config = require('config');
var fs = require('fs');
var _ = require('lodash');

function getDefault(config) {
    return config._default;
}

function getEnvironments(config) {
    var tmpConfig = _.clone(config);
    delete tmpConfig._default;
    return tmpConfig;
}

function applyDefaults(config) {
    var defaults = getDefault(config);
    var environments = getEnvironments(config);
    return _.mapValues(environments, function(environment) {
        return _.merge({}, defaults, environment);
    });
}

module.exports = function() {
    var rawConfig = require(config.get('dbConfigPath'));
    var localConfigPath = config.get('dbConfigPath')
        .replace('.json', '.local.json');
    var rawLocalConfig = {};
    var combinedConfig = {};
    try {
        if (fs.statSync(localConfigPath).isFile()) {
            rawLocalConfig = require(localConfigPath);
        }
    } catch (err) {
        console.log('no local dbadmin config found, using defaults');
    }

    combinedConfig = _.merge({}, rawConfig, rawLocalConfig);
    return applyDefaults(combinedConfig)[config.get('environment')];
};
