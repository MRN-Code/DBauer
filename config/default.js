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
            'mrs_modality_properties',
            'mrs_scan_data_types',
            'mrs_dataentry_types',
            'mrs_collection_techniques',
            'mrs_configs',
            'mrs_dsm_codes',
            'mrs_dsm_groups',
            'mrs_dsm_specifiers',
            'mrs_instrument_question_media_types',
            'mrs_instrument_question_response_format',
            'mrs_message_types',
            'mrs_personaddress_types',
            'mrs_personphone_types',
            'mrs_racial_categories',
            'mrs_source_type',
            'mrs_subject_tags',
            'mrs_series_definitions',
        ],
        rowsByStudyId: [
            'mrs_studies',
            'mrs_instruments_studies',
            'mrs_assessments',
            'mrs_data_domains',
            'mrs_document_categories',
            'mrs_person_role_details',
            'mrs_study_intervals',
            'mrs_study_asmt_prot',
            'mrs_study_trackers',
            'mrs_subject_tag_details',
            'mrs_subject_types',
            'mrs_scan_sessions',
            'mrs_series_labels'
        ],
        rowsBySiteId: [
            'cas_sites_config',
            'cas_sites',
            'mrs_scanners'
        ],
        rowsFromMultiTable: [
            {
                tableName: 'mrs_addresses',
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
            },
            {
                tableName: 'mrs_assessment_events',
                joins: [
                    {
                        tableName: 'mrs_assessments',
                        columnName: 'assessment_id'
                    }
                ],
                where: 'study'
            },
            {
                tableName: 'mrs_assessment_responses',
                joins: [
                    {
                        tableName: 'mrs_assessments',
                        columnName: 'assessment_id'
                    }
                ],
                where: 'study'
            },
            {
                tableName: 'mrs_doc_category_details',
                joins: [
                    {
                        tableName: 'mrs_document_categories',
                        columnName: 'category_id'
                    }
                ],
                where: 'study'
            },
            {
                tableName: 'mrs_documents',
                joins: [
                    {
                        tableName: 'mrs_doc_category_details',
                        columnName: 'file_id'
                    },
                    {
                        tableName: 'mrs_document_categories',
                        columnName: 'category_id'
                    }
                ],
                where: 'study'
            },
            {
                tableName: 'mrs_instrument_tables',
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
                tableName: 'mrs_instrument_table_rows',
                joins: [
                    {
                        tableName: 'mrs_instrument_tables',
                        columnName: 'table_id'
                    },
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
                tableName: 'mrs_instrument_table_columns',
                joins: [
                    {
                        tableName: 'mrs_instrument_tables',
                        columnName: 'table_id'
                    },
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
                tableName: 'mrs_instrument_code_responses',
                joins: [
                    {
                        tableName: 'mrs_instrument_questions',
                        columnName: 'question_id'
                    },
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
                tableName: 'mrs_instrument_question_jumps',
                joins: [
                    {
                        tableName: 'mrs_instrument_questions',
                        columnName: 'question_id'
                    },
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
                tableName: 'mrs_instrument_question_loops',
                joins: [
                    {
                        tableName: 'mrs_instrument_questions',
                        columnName: 'question_id'
                    },
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
                tableName: 'mrs_instrument_question_media',
                joins: [
                    {
                        tableName: 'mrs_instrument_questions',
                        columnName: 'question_id'
                    },
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
                tableName: 'mrs_instrument_sections',
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
                tableName: 'mrs_instruments',
                joins: [
                    {
                        tableName: 'mrs_instruments_studies',
                        columnName: 'instrument_id'
                    }
                ],
                where: 'study'
            },
            {
                tableName: 'mrs_person_alias',
                joins:[
                    {
                        tableName:'mrs_person_role_details',
                        columnName: 'alias_id'
                    }
                ],
                where: 'study'
            },
            {
                tableName: 'mrs_person_phone_details',
                joins:[
                    {
                        tableName:'mrs_person_role_details',
                        columnName: 'person_id'
                    }
                ],
                where: 'study'
            },
            {
                tableName: 'mrs_persons',
                joins:[
                    {
                        tableName:'mrs_person_role_details',
                        columnName: 'person_id'
                    }
                ],
                where: 'study'
            },
            {
                tableName: 'cas_users',
                joins:[],
                where: ['label', 'mocha test']
            },
            {
                tableName: 'cas_app_user_role_privs',
                joins:[
                    {tableName:'cas_users', columnName: 'username'}
                ],
                where: ['cas_users.label', 'mocha test']
            },
            {
                tableName: 'cas_study_user_role_privs',
                joins:[
                    {tableName:'cas_users', columnName: 'username'}
                ],
                where: ['cas_users.label', 'mocha test']
            },
            {
                tableName: 'cas_apps',
                joins:[],
                where: ['label', 'NOT LIKE', '%Portal%']
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
            },
            {
                tableName: 'mrs_subjects_racial_categories',
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
            },
            {
                tableName: 'mrs_subject_type_details',
                joins: [
                    {
                        tableName: 'mrs_subject_types',
                        columnName: 'subject_type_id'
                    }
                ],
                where: 'study'
            },
            {
                tableName: 'mrs_series',
                joins: [
                    {
                        tableName: 'mrs_scan_sessions',
                        columnName: 'scan_id'
                    }
                ],
                where: 'study'
            },
            {
                tableName: 'mrs_series_data',
                joins: [
                    {
                        tableName: 'mrs_series',
                        columnName: 'series_id'
                    },
                    {
                        tableName: 'mrs_scan_sessions',
                        columnName: 'scan_id'
                    }
                ],
                where: 'study'
            },

        ],
        rawRows: [
            {
                tableName: 'cas_users',
                rows: [
                    /* jscs:disable */
                    {
                        username: 'qApQHNJb3dpswjH9utr1Fw==',
                        label: 'Test Superuser',
                        active_flag: 'Y', //jshint ignore:line
                        acct_exp_date: '2200-01-11 00:00:00',//jshint ignore:line
                        password_exp_date: '2200-01-11 00:00:00',//jshint ignore:line
                        site_id: '7',//jshint ignore:line
                        is_site_admin: 'N',//jshint ignore:line
                        email: 'ni@mrn.org',
                        email_unsubscribed: false,//jshint ignore:line
                        password_hash: '$2y$12$/50tY05bs/K47ZKkcTWrxOGFdwz5SokjGx/e9kdbBInCXJO/MpnH.'//jshint ignore:line
                    }
                    /* jscs:enable */
                ]
            },
            {
                tableName: 'cas_app_user_role_privs',
                rows: [
                    /* jscs:disable */
                    {
                        app_id: 22,//jshint ignore:line
                        username: 'qApQHNJb3dpswjH9utr1Fw==',
                        role_id: 1,//jshint ignore:line
                        granted_date: '2015-11-11 19:52:42.305595'//jshint ignore:line
                    },
                    {
                        app_id: 24,//jshint ignore:line
                        username: 'qApQHNJb3dpswjH9utr1Fw==',
                        role_id: 1,//jshint ignore:line
                        granted_date: '2015-11-11 19:52:42.305595'//jshint ignore:line
                    },
                    {
                        app_id: 1,//jshint ignore:line
                        username: 'qApQHNJb3dpswjH9utr1Fw==',
                        role_id: 1,//jshint ignore:line
                        granted_date: '2015-11-11 19:52:42.305595'//jshint ignore:line
                    }
                    /* jscs:enable */
                ]
            }
        ]
    }
};
