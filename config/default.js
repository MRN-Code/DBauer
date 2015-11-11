'use strict';
module.exports = {
    dbConfigPath: '/coins/config/dbadmin.json',
    srcDbName: 'coins',
    tempDbName: 'temp_dev_db',
    environment: 'development',
    schemaSearchPath: 'mrsdba,casdba,dxdba,dtdba',
    destPath: require('path').join(__dirname, '../dist/coins.pgdump'),
    seedDataConfig: {
        seedStudyId: 10,
        seedSiteId: '7',
        allRows: [
            'cas_roles',
            'cas_sites_config',
            'mrs_modalities',
            'mrs_scan_data_types'
        ],
        rowsByStudyId: [
            'mrs_studies',
            'mrs_instruments_studies'
        ],
        rowsBySiteId: [
            'cas_sites',
            'cas_sites_config'
        ],
        rowsFromMultiTable: [
            {
                tableName: 'mrs_instrument_questions',
                joins: [
                    {
                        tableName: 'mrs_instrument_section_details',
                        columnName: 'section_id'
                    },
                    {
                        tableName: 'mrs_instruments_studies',
                        columnName: 'instrument_id'
                    }
                ],
                where: 'study'
            },
            {
                tableName: 'mrs_subjects',
                joins: [
                    {
                        tableName: 'mrs_subject_type_details',
                        columnName: 'usid'
                    },
                    {
                        tableName: 'mrs_subject_types',
                        columnName: 'subject_type_id'
                    }
                ],
                where: 'study'
            }
        ]
    }
};
