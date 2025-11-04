// SPDX-FileCopyrightText: 2025 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

package it.bz.noi.automated.data.quality.monitoring.tool;


import java.io.IOException;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ReadinessServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (FlywayMigrationListener.migrationComplete) {
            resp.setStatus(200);
            resp.getWriter().write("ready");
        } else {
            resp.setStatus(503);
            resp.getWriter().write("not ready");
        }
    }
}
