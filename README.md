# DBauer (DB Bauer)
Utility for copying the COINS database schema and seeding it with data.
(Bauer means 'farmer' in German). The resulting database is free of any
confidential or sensitive information and can be used on your local device
(or in the cloud for automated tesing!).

# Nighly dumps
Nighly dumps of our development database schema can be found at https://mrn-code.s3-us-west-2.amazonaws.com/schema-dump/latest.pgdump. They are
put there by this repo, running on [tmp]lintcoin within the MRN network.

# TODO
1. Monitoring: configure monit/mmonit to check whether this process is running
every 24 hours.
1. Automation: Add the dbauer-aws-credentials and this repo to Ansible.
1. Add more seed data for more thorough testing.

# Cron
Copy _cron/coins-dbauer_ to _/etc/cron.daily/coins-dbauer_ and ensure that it
is executable.

# Users
This script copies all users associated with the 'Hogwarts' site. It also adds
a superuser. The following usernames can be used to access COINS at various
levels of permissions. The password for all users except mocahtest is
`SherbetLemon`.

* adumbledore: PI
* mmcgonagal: Coordinator
* testsuper: super user
* mochatest: for node tests

# Workflow

1. Dump schema only of current development databaset
1. Create new temporary DB from schema dump
1. Select seed data from current development database
1. Disable triggers and constraints
1. Insert seed data into temporary DB
1. Dump temporary database to disk
1. Upload dump to AWS S3 (https://mrn-code.s3.amazonaws.com/schema-dump/latest.pgdump)
1. Drop temporary database

# Configuration
The data that gets selected in step 3 above is determined by the Configuration
in _config/default.js_. The config consists of five main sections that group
tables into categories based on how their rows should be filtered:

1. **allRows:** All rows are selected from these tables.
1. **rowsByStudyId:** Only rows matching the `seedStudyId` are selected.
1. **rowsBySiteId:** Only rows matching the `seedSiteId` are selected.
1. **rawRows:** Array of JSON objects to be directly inserted into `tableName`.
1. **rowsFromMultiTable:** Selects rows from the `tableName` by joining to the
tables listed in `joins` on the `columnName`. It is assumed that the tables
listed in `joins` are in a specific order. The `where` criteria can be `'site'`,
`'study'`, or a knex `where` array.

Example:
```js
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
}
```
Will translate to the following knex:
```js
knex('mrs_addresses')
    .distinct('mrs_addresses.*')
    .innerJoin(
        'mrs_subject_type_details',
        'mrs_subject_type_details.usid',
        'mrs_addresses.usid'
    )
    .innerJoin(
        'mrs_subject_types',
        'mrs_subject_types.subject_type_id',
        'mrs_subject_type_details.subject_type_id'
    )
    .where('study_id', seedStudyId);
```
Which translates to the following SQL:
```sql
SELECT DISTINCT mrs_addresses.*
FROM mrs_addresses
INNER JOIN mrs_subject_type_details
    ON mrs_subject_type_details.usid = mrs_addresses.usid
INNER JOIN mrs_subject_types
    ON mrs_subject_types.subject_type_id = mrs_subject_type_details.subject_type_id
WHERE study_id = 8320;
```

There are a few use cases that are not covered by the above sections:

1. The column on which two tables are joined has a different name in each table.
1. A `WHERE a IN (1,2,3)` scenario
