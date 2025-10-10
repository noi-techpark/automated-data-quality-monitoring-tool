<!--
SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# Automated data quality monitoring tool

This is a tool to monitor data quality of the Open Data Hub.

It's comprised of a webapplication and a job, see the respective README.md files in the subirectories for more information

## Database initialization
The database is setup by running the `database/database.sql` file as the user that later also runs the job.  
This is important because the job runs it's own database migrations through prism, which will fail if the user does not have adequate permissions.
