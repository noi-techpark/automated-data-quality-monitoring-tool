// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

package it.bz.noi.automated.data.quality.monitoring.tool;

import org.flywaydb.core.Flyway;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;

public class FlywayMigrationListener implements ServletContextListener {
        public static volatile boolean migrationComplete = false;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            Flyway flyway = Flyway.configure()
                .dataSource(System.getenv("JDBC_URL"), null, null)
                .locations("classpath:db/migration")
                .load();
            flyway.migrate();
            migrationComplete = true;
        } catch (Exception e) {
            throw new RuntimeException("Flyway migration failed", e);
        }
    }
}