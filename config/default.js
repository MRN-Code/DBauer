'use strict';
module.exports = {
    dbConfigPath: '/coins/config/dbadmin.json',
    srcDbName: 'coins',
    tempDbName: 'temp_dev_db',
    environment: 'development',
    schemaSearchPath: 'mrsdba,casdba,dxdba,dtdba',
    destPath: require('path').join(__dirname, '../dist/coins.pgdump'),
    seedDataConfig: {
        seedStudyId: 2319,
        seedSiteId: '7',
        allRows: [
            'cas_roles',
            'mrs_modalities',
            'mrs_scan_data_types'
        ],
        rowsByStudyId: [
            'mrs_studies',
            'mrs_instruments_studies'
        ],
        rowsBySiteId: [
            'cas_sites_config',
            'cas_sites'
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
        ],
        rawRows: [
            {
                tableName: 'cas_sites',
                rows: [
                    /* jscs:disable */
                    {site_id: '8', label: 'foo', description: 'foo'} //jshint ignore:line
                    /* jscs:enable */
                ]
            }
        ]
    }
};
