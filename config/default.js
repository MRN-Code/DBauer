'use strict';
module.exports = {
    dbConfigPath: '/coins/config/dbadmin.json',
    environment: 'development'
};
/*
var knex = require('knex')({client: 'postgresql'});
var seedStudyId = 10;
var seedSiteId = '7';
var allDataTables = [
    'cas_roles',
    'cas_sites_config',
    'mrs_modalities'
];
var studyDataTables = [
    'mrs_studies',
    'mrs_instruments_studies'
];
var siteDataTables = [
    'cas_sites',
    'cas_sites_config',
];
var seedDataConfigs = [
    knex.select('mrs_instrument_questions.*')
        .from('mrs_instrument_questions')
        .innerJoin('mrs_instrument_section_details', 'section_id', 'section_id')
        .innerJoin('mrs_instrument_studies', 'instrument_id', 'instrument_id')
        .where('study_id', seedStudyId),
    knex('mrs_subjects').distinct('mrs_subjects.*')
        .innerJoin('mrs_subject_type_details', 'usid', 'usid')
        .innerJoin('mrs_subject_types', 'subject_type_id', 'subject_type_id')
        .where('study_id', seedStudyId)
];

function setSiteData(tableName) {
    return knex(tableName).where('site_id', seedSiteId);
}

function setStudyData(tableName) {
    return knex(tableName).where('study_id', seedStudyId);
}

function setAllData(tableName) {
    return knex(tableName);
}

function callToSql(knexObj) {
    return knexObj.toSQL();
}

module.exports = {
    seedDataConfigs: seedDataConfigs
        .concat(siteDataTables.map(setSiteData))
        .concat(studyDataTables.map(setStudyData))
        .concat(allDataTables.map(setAllData))
        //.map(callToSql)
};

console.log(module.exports.seedDataConfigs[0]._single);
*/
