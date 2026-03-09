// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

package it.bz.noi.automated.data.quality.monitoring.tool;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.LongNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.NumericNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.ibm.icu.text.SimpleDateFormat;
import com.ibm.icu.util.TimeZone;

import it.bz.noi.automated.data.quality.monitoring.tool.APIServlet.UserAuthInfo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class APIHelper
{


	private static final String YYYY_MM_DD_T_HH_MM_SS_XXX = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";

	public static void processRequest(HttpServletRequest req, HttpServletResponse resp, UserAuthInfo auth) throws SQLException, IOException, ParseException
	{
		ObjectMapper om = new ObjectMapper();

		String action = req.getParameter("action");
		String filter = req.getParameter("filter_byexample");
		if (filter == null)
			filter = "{}";
		ObjectNode filterJson = (ObjectNode) om.readTree(filter);
		ArrayNode list;
		switch (action)
		{
			case "catchsolve_noiodh.test_dataset_check_category_failed_recors_vw":
				resp.setContentType("application/json");
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw(
						req.getParameter("test_dataset_ids"), auth);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_check_category_check_name_failed_recors_vw":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw(filterJson, auth);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_record_check_failed":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__test_dataset_record_check_failed(filterJson, auth);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_record_check_failed__of_ids":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__test_dataset_record_check_failed__of_ids(filterJson, auth);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_record_check_failed_check_name__of_ids":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__test_dataset_record_check_failed_check_name__of_ids(filterJson, auth);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_history_vw":
				resp.setContentType("application/json");
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__test_dataset_history_vw(filterJson, auth);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.dashboards":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__catchsolve_noiodh__dashboards(filterJson, auth);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.custom_dashboard":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__catchsolve_noiodh__custom_dashboard(filterJson, auth);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.custom_dashboards_next_id":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__catchsolve_noiodh__custom_dashboards_next_id();
				resp.getWriter().write(list.toPrettyString());
				break;
			case "auth_roles":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				ArrayNode rolesList = om.createArrayNode();
				for (String role : auth.getRoles()) {
					rolesList.add(role);
				}
				resp.getWriter().write(rolesList.toPrettyString());
				break;



		}
	}

	private static ArrayNode list__test_dataset_history_vw(ObjectNode filter, UserAuthInfo auth) throws SQLException
	{
		String sql = """
				select td.session_start_ts, td.check_name,
				       (select count(distinct record_jsonpath)
				          from catchsolve_noiodh.test_dataset_record_check_failed tdrcf
				         where tdrcf.test_dataset_id = td.id) as failed_recs,
				       td.tested_records
				  from catchsolve_noiodh.test_dataset td
				 where td.owner in (?, ?)
				   and td.used_key = ?
				   and (td.dataset_name, td.dataset_subset, td.owner, td.used_key, td.check_name) = (
				       select td2.dataset_name, td2.dataset_subset, td2.owner, td2.used_key, td2.check_name
				         from catchsolve_noiodh.test_dataset td2
				        where td2.id = ?
				          and td2.owner in (?, ?)
				          and td2.used_key = ?
				   )
				order by session_start_ts desc
				limit 5
 
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		String userId = auth.getSub();
		String userRole = auth.getCurrentRole();
		wherevalues.add("public");
		wherevalues.add(userId);
		wherevalues.add(userRole);
		wherevalues.add(((NumericNode)filter.get("test_dataset_id")).numberValue().intValue());
		wherevalues.add("public");
		wherevalues.add(userId);
		wherevalues.add(userRole);
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__test_dataset_record_check_failed__of_ids(ObjectNode filter, UserAuthInfo auth) throws ParseException, SQLException
	{
		String sql = """
		      select record_jsonpath, record_json, count(distinct check_name) as nr_check_names
			    from catchsolve_noiodh.test_dataset_record_check_failed
			   where test_dataset_id = ANY(string_to_array(?, ',')::bigint[]) 
			     and owner in (?, ?)
			     and used_key = ?
			   group by 1,2
			  offset ?
			   limit ?
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		String userId = auth.getSub();
		String userRole = auth.getCurrentRole();
		String test_dataset_ids = ((TextNode)filter.get("test_dataset_ids")).textValue();
 		wherevalues.add(test_dataset_ids);
 		wherevalues.add("public");
 		wherevalues.add(userId);
 		wherevalues.add(userRole);
 		wherevalues.add(filter.get("offset") == null ? 0 : ((IntNode)filter.get("offset")).intValue());
 		wherevalues.add(filter.get("limit") == null ? 99999 : ((IntNode)filter.get("limit")).intValue());
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__test_dataset_record_check_failed_check_name__of_ids(ObjectNode filter, UserAuthInfo auth) throws ParseException, SQLException
	{
		String sql = """
		      select check_name
			    from catchsolve_noiodh.test_dataset_record_check_failed
			   where test_dataset_id = ANY(string_to_array(?, ',')::bigint[])
			     and record_jsonpath = ?
			     and owner in (?, ?)
			     and used_key = ?
			   order by check_name
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		String userId = auth.getSub();
		String userRole = auth.getCurrentRole();
		wherevalues.add(((TextNode)filter.get("test_dataset_ids")).textValue());
		wherevalues.add(((TextNode)filter.get("record_jsonpath")).textValue());
		wherevalues.add("public");
		wherevalues.add(userId);
		wherevalues.add(userRole);
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__test_dataset_record_check_failed(ObjectNode filter, UserAuthInfo auth) throws ParseException, SQLException
	{
		String sql = """
				select *
				  from catchsolve_noiodh.test_dataset_record_check_failed
				 where test_dataset_id = ?
				   and owner in (?, ?)
				   and used_key = ?
				 order by id
			   offset ?
				 limit ?
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		String userId = auth.getSub();
		String userRole = auth.getCurrentRole();
		// wherevalues.add(((TextNode)filter.get("dataset_name")).textValue());
		// wherevalues.add(jsdate2timestamp(((TextNode)filter.get("session_start_ts")).textValue()));
 		// wherevalues.add(((TextNode)filter.get("check_category")).textValue());
 		// wherevalues.add(filter.get("check_name")  == null ? "%" : ((TextNode)filter.get("check_name")).textValue());
 		// wherevalues.add(filter.get("record_jsonpath") == null ? "%" : ((TextNode)filter.get("record_jsonpath")).textValue());
 		wherevalues.add(filter.get("test_dataset_id") == null ? 0 : ((IntNode)filter.get("test_dataset_id")).intValue());
 		wherevalues.add("public");
 		wherevalues.add(userId);
 		wherevalues.add(userRole);
 		wherevalues.add(filter.get("offset") == null ? 0 : ((IntNode)filter.get("offset")).intValue());
 		wherevalues.add(filter.get("limit") == null ? 99999 : ((IntNode)filter.get("limit")).intValue());
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__catchsolve_noiodh__custom_dashboard(ObjectNode filter, UserAuthInfo auth) throws SQLException
	{
		String userRole = auth.getCurrentRole();
		String userId = auth.getSub();
		Integer id = null;
		if (filter.get("id") != null && !filter.get("id").isNull())
			id = filter.get("id").asInt();
		ArrayList<Object> wherevalues = new ArrayList<>();
		StringBuilder sql = new StringBuilder("""
				select
					user_id,
					user_role,
					name,
					test_definition_json
				from catchsolve_noiodh.custom_dashboards
				where user_id = ?
				and user_role = ?
				and id = ?
				""");
		wherevalues.add(userId);
		wherevalues.add(userRole);
		wherevalues.add(id);
		return execute_query(sql.toString(), wherevalues);
	}

	private static ArrayNode list__catchsolve_noiodh__dashboards(ObjectNode filter, UserAuthInfo auth) throws SQLException
	{
		String userRole = auth.getCurrentRole();
		String userId = auth.getSub();
		String kind = filter.get("kind").asText();
		System.out.println("KIND:"  + kind);
		if (kind.equals("standard"))
			userId = "public";
		ArrayList<Object> wherevalues = new ArrayList<>();
		StringBuilder sql = new StringBuilder("""
			select td.dataset_name, td.dataset_subset, owner, used_key, session_start_ts, tested_records, dataset_img_url, 
					max(dataset_query_url) as dataset_query_url,
					(select count(distinct record_jsonpath) from catchsolve_noiodh.test_dataset_record_check_failed tdrcf where tdrcf.test_dataset_id = any(array_agg(td.id))) as failed_records,
					json_agg(jsonb_build_object('custom_dashboard_id', td.custom_dashboard_id, 'name', cd.name)) filter (where td.custom_dashboard_id is not null)::text as custom_dashboards, string_agg('' || td.id, ',' order by td.id) as ids_csv				
				from catchsolve_noiodh.test_dataset td 
				left join catchsolve_noiodh.custom_dashboards cd on td.custom_dashboard_id  = cd.id 
			where (td.dataset_name, td.dataset_subset, owner, used_key, session_start_ts) in (
			select td.dataset_name, td.dataset_subset, owner, used_key, max(session_start_ts) as last_ts
				from catchsolve_noiodh.test_dataset td 
			where owner = ?
			  and used_key = ?
			group by 1,2,3,4
			)
			group by 1,2,3,4,5,6,7
			union all
			select test_definition_json::jsonb ->> 'dataset', name, user_id, cd2.user_role, to_timestamp(0), 0, '' , '', 0, jsonb_build_array(jsonb_build_object('custom_dashboard_id', cd2.id, 'name', cd2.name))::text, ''
				from  catchsolve_noiodh.custom_dashboards cd2
			where id not in (select custom_dashboard_id from catchsolve_noiodh.test_dataset where custom_dashboard_id is not null)
				and cd2.user_id  = ?
				and cd2.user_role = ?
						
				""");
		wherevalues.add(userId);
		wherevalues.add(userRole);
		wherevalues.add(userId);
		wherevalues.add(userRole);
		// sql.append(" order by dataset_name");
		String sqltxt = sql.toString();
		return execute_query(sqltxt, wherevalues);
	}

	private static ArrayNode list__catchsolve_noiodh__custom_dashboards_next_id() throws SQLException
	{
		String sql = "select nextval('catchsolve_noiodh.custom_dashboards_id_seq') as id";
		return execute_query(sql, new ArrayList<>());
	}

	private static ArrayNode list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw(String testDatasetIds, UserAuthInfo auth) throws SQLException
	{
		StringBuilder sql = new StringBuilder("""
				select session_start_ts,
					dataset_name,
					check_category,
					check_name,
					test_dataset_id,
					(select tested_records from catchsolve_noiodh.test_dataset t where t.id = f.test_dataset_id) as tot_records,
					count(DISTINCT f.record_jsonpath) as failed_records
				from catchsolve_noiodh.test_dataset_record_check_failed  f
				where test_dataset_id = ANY(string_to_array(?, ',')::bigint[]) 
				  and owner in (?, ?)
				  and used_key = ?
				group by 1,2,3,4,5,6
				order by check_name
				""");
		ArrayList<Object> wherevalues = new ArrayList<>();
		String userId = auth.getSub();
		String userRole = auth.getCurrentRole();
		wherevalues.add(testDatasetIds);
		wherevalues.add("public");
		wherevalues.add(userId);
		wherevalues.add(userRole);
		return execute_query(sql.toString(), wherevalues);
	}

	private static ArrayNode list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw(ObjectNode filter, UserAuthInfo auth) throws ParseException, SQLException
	{
		String sql = """
				select
					f.check_category,
					f.check_name,
					f.dataset_name,
					count(DISTINCT f.record_jsonpath) as failed_records,
					f.session_start_ts,
					(
						select count(DISTINCT f2.record_jsonpath)
						from catchsolve_noiodh.test_dataset_record_check_failed f2
						where f2.session_start_ts = f.session_start_ts
						  and f2.dataset_name = f.dataset_name
						  and f2.owner in (?, ?)
						  and f2.used_key = ?
					) as tot_records
				  from catchsolve_noiodh.test_dataset_record_check_failed f
				 where f.dataset_name = ?
				   and f.session_start_ts = ?
				   and f.check_category = ?
				   and f.owner in (?, ?)
				   and f.used_key = ?
				 group by f.check_category, f.check_name, f.dataset_name, f.session_start_ts
				 order by f.check_category
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		String userId = auth.getSub();
		String userRole = auth.getCurrentRole();
		wherevalues.add("public");
		wherevalues.add(userId);
		wherevalues.add(userRole);
		wherevalues.add(((TextNode)filter.get("dataset_name")).textValue());
		wherevalues.add(jsdate2timestamp(((TextNode)filter.get("session_start_ts")).textValue()));
		wherevalues.add(((TextNode)filter.get("check_category")).textValue());
		wherevalues.add("public");
		wherevalues.add(userId);
		wherevalues.add(userRole);
		return execute_query(sql, wherevalues);
	}

	static ArrayNode execute_query(String sql, ArrayList<Object> wherevalues) throws SQLException
	{
		ObjectMapper om = new ObjectMapper();
		try (Connection conn = DriverManager.getConnection(System.getenv("JDBC_URL")))
		{
			PreparedStatement pstmt = conn.prepareStatement(sql);
			for (int w = 0; w < wherevalues.size(); w++)
				pstmt.setObject(w + 1, wherevalues.get(w));
			System.out.println(pstmt.toString());
			ResultSet rs = pstmt.executeQuery();
			ArrayNode list = om.createArrayNode();
			ResultSetMetaData meta = rs.getMetaData();
			while (rs.next())
			{
				ObjectNode rec = om.createObjectNode();
				for (int c = 0; c < meta.getColumnCount(); c++)
				{
					String name = meta.getColumnLabel(c + 1);
					Object value = rs.getObject(c + 1);
					// ystem.out.println("readin " + name + " value");
					JsonNode valueJson = value == null ? NullNode.instance : switch (value.getClass().getName())
					{
						case "java.lang.String" -> TextNode.valueOf((String)value);
						case "java.lang.Long" -> LongNode.valueOf((Long)value);
						case "java.lang.Integer" -> IntNode.valueOf((Integer)value);
						case "java.sql.Timestamp" -> TextNode.valueOf(timestamp2jsdate((Timestamp)value));
						default -> throw new IllegalStateException(value.getClass().getName());
					};
					rec.set(name, valueJson);
				}
				list.add(rec);
			}
			return list;
		}
	}

	static Timestamp jsdate2timestamp(String ts) throws ParseException
	{
		if (!ts.endsWith("Z"))
			throw new IllegalStateException(ts);
		SimpleDateFormat sdf = new SimpleDateFormat(YYYY_MM_DD_T_HH_MM_SS_XXX);
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
		Date jsdate = sdf.parse(ts);
		return new Timestamp(jsdate.getTime());
	}

	static String timestamp2jsdate(Timestamp ts)
	{
		SimpleDateFormat sdf = new SimpleDateFormat(YYYY_MM_DD_T_HH_MM_SS_XXX);
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
		String jsdate = sdf.format(ts);
		if (!jsdate.endsWith("Z"))
			throw new IllegalStateException(jsdate);
		return jsdate;
	}

}
