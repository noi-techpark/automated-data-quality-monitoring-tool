/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

package it.bz.noi.automated.data.quality.monitoring.tool;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class APIServlet extends HttpServlet
{
	@Override public void init(ServletConfig config) throws ServletException
	{
		super.init(config);
		try
		{
			Class.forName("org.postgresql.Driver");
		}
		catch (ClassNotFoundException e)
		{
			throw new ServletException(e);
		}
	}

	@Override protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		try
		{
			resp.addHeader("Access-Control-Allow-Origin", "*");
			APIHelper.processRequest(req, resp);
		}
		catch (Exception exxx)
		{
			throw new ServletException(exxx);
		}
	}
}
