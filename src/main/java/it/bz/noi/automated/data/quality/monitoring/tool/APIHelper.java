/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

package it.bz.noi.automated.data.quality.monitoring.tool;

import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.LongNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.ibm.icu.text.SimpleDateFormat;
import com.ibm.icu.util.TimeZone;


public class APIHelper
{


	private static final String YYYY_MM_DD_T_HH_MM_SS_XXX = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";

	public static void processRequest(HttpServletRequest req, HttpServletResponse resp) throws SQLException, IOException, ParseException
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
			case "get_dataset_list":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				resp.getWriter().write(get_dataset_list());
				break;
			case "catchsolve_noiodh.test_dataset_check_name_count_records_vw":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__catchsolve_noiodh__test_dataset_check_name_count_records(filterJson);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_check_name_fields_record_id_snippet_vw":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__catchsolve_noiodh__test_dataset_check_name_fields_record_id_snippet_vw(filterJson);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_record_count_attributes_vw":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__catchsolve_noiodh__test_dataset_record_count_attributes_vw(filterJson);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_check_category_failed_recors_vw":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw(filterJson);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_check_category_check_name_failed_recors_vw":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw(filterJson);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.catchsolve_noiodh__test_dataset_max_ts_vw":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__catchsolve_noiodh__test_dataset_maxts_vw(filterJson);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_check_category_check_name_record_record_failed_vw":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__test_dataset_check_category_check_name_record_record_failed_vw(filterJson);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_record_check_failed":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__test_dataset_record_check_failed(filterJson);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_check_category_record_jsonpath_failed_vw":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__test_dataset_check_category_record_jsonpath_failed_vw(filterJson);
				resp.getWriter().write(list.toPrettyString());
				break;
			case "catchsolve_noiodh.test_dataset_history_vw":
				resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
				list = list__test_dataset_history_vw(filterJson);
				resp.getWriter().write(list.toPrettyString());
				break;



		}
	}

	private static ArrayNode list__test_dataset_history_vw(ObjectNode filter) throws SQLException
	{
		String sql = """
				select *
				  from catchsolve_noiodh.test_dataset_history_vw
				 where dataset_name = ?
				   and check_category = ?
				 order by dataset_name, session_start_ts desc
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		wherevalues.add(((TextNode)filter.get("dataset_name")).textValue());
		wherevalues.add(((TextNode)filter.get("check_category")).textValue());
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__test_dataset_check_category_record_jsonpath_failed_vw(ObjectNode filter) throws ParseException, SQLException
	{
		String sql = """
				select *
				  from catchsolve_noiodh.test_dataset_check_category_record_jsonpath_failed_vw
				 where dataset_name = ?
				   and session_start_ts = ?
				   and check_category = ?
				 order by check_category
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		wherevalues.add(((TextNode)filter.get("dataset_name")).textValue());
		wherevalues.add(jsdate2timestamp(((TextNode)filter.get("session_start_ts")).textValue()));
 		wherevalues.add(((TextNode)filter.get("check_category")).textValue());
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__test_dataset_record_check_failed(ObjectNode filter) throws ParseException, SQLException
	{
		String sql = """
				select *
				  from catchsolve_noiodh.test_dataset_record_check_failed
				 where dataset_name = ?
				   and session_start_ts = ?
				   and check_category = ?
				   and check_name  like  ?
				   and record_jsonpath like ?
				 order by check_category
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		wherevalues.add(((TextNode)filter.get("dataset_name")).textValue());
		wherevalues.add(jsdate2timestamp(((TextNode)filter.get("session_start_ts")).textValue()));
 		wherevalues.add(((TextNode)filter.get("check_category")).textValue());
 		wherevalues.add(filter.get("check_name")  == null ? "%" : ((TextNode)filter.get("check_name")).textValue());
 		wherevalues.add(filter.get("record_jsonpath") == null ? "%" : ((TextNode)filter.get("record_jsonpath")).textValue());
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__test_dataset_check_category_check_name_record_record_failed_vw(ObjectNode filter) throws ParseException, SQLException
	{
		String sql = """
				select *
				  from catchsolve_noiodh.test_dataset_check_category_check_name_record_record_failed_vw
				 where dataset_name = ?
				   and session_start_ts = ?
				   and check_category = ?
				 order by check_category
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		wherevalues.add(((TextNode)filter.get("dataset_name")).textValue());
		wherevalues.add(jsdate2timestamp(((TextNode)filter.get("session_start_ts")).textValue()));
 		wherevalues.add(((TextNode)filter.get("check_category")).textValue());
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__catchsolve_noiodh__test_dataset_maxts_vw(ObjectNode filterJson) throws SQLException
	{
		String sql = """
				select *
				  from catchsolve_noiodh.test_dataset_max_ts_vw
				 order by dataset_name
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__catchsolve_noiodh__test_dataset_check_category_failed_recors_vw(ObjectNode filter) throws ParseException, SQLException
	{
		String sql = """
				select *
				  from catchsolve_noiodh.test_dataset_check_category_failed_recors_vw
				 where dataset_name = ?
				   and session_start_ts = ?
				 order by check_category
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		wherevalues.add(((TextNode)filter.get("dataset_name")).textValue());
		wherevalues.add(jsdate2timestamp(((TextNode)filter.get("session_start_ts")).textValue()));
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__catchsolve_noiodh__test_dataset_check_category_check_name_failed_recors_vw(ObjectNode filter) throws ParseException, SQLException
	{
		String sql = """
				select *
				  from catchsolve_noiodh.test_dataset_check_category_check_name_failed_recors_vw
				 where dataset_name = ?
				   and session_start_ts = ?
				   and check_category = ?
				 order by check_category
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		wherevalues.add(((TextNode)filter.get("dataset_name")).textValue());
		wherevalues.add(jsdate2timestamp(((TextNode)filter.get("session_start_ts")).textValue()));
		wherevalues.add(((TextNode)filter.get("check_category")).textValue());
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__catchsolve_noiodh__test_dataset_record_count_attributes_vw(ObjectNode filter) throws ParseException, SQLException
	{
		String sql = """
				select *
				  from catchsolve_noiodh.test_dataset_record_count_attributes_vw
				 where (? is null or dataset_name like ?)
				   and (?::timestamptz is null or session_start_ts = ?)
				 order by record_names
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		wherevalues.add(((TextNode)filter.get("dataset_name")).textValue());
		wherevalues.add(wherevalues.get(wherevalues.size() - 1));
		wherevalues.add(jsdate2timestamp(((TextNode)filter.get("session_start_ts")).textValue()));
		wherevalues.add(wherevalues.get(wherevalues.size() - 1));
		return execute_query(sql, wherevalues);
	}

	private static ArrayNode list__catchsolve_noiodh__test_dataset_check_name_fields_record_id_snippet_vw(ObjectNode filter) throws SQLException, ParseException
	{
		String sql = """
				select *
				  from catchsolve_noiodh.test_dataset_check_name_fields_record_id_snippet_vw
				 where (? is null or dataset_name like ?)
				   and (?::timestamptz is null or session_start_ts = ?)
				   and (? is null or check_name = ?)
				 order by record_names
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		wherevalues.add(((TextNode)filter.get("dataset_name")).textValue());
		wherevalues.add(wherevalues.get(wherevalues.size() - 1));
		wherevalues.add(jsdate2timestamp(((TextNode)filter.get("session_start_ts")).textValue()));
		wherevalues.add(wherevalues.get(wherevalues.size() - 1));
		wherevalues.add(((TextNode)filter.get("check_name")).textValue());
		wherevalues.add(wherevalues.get(wherevalues.size() - 1));
		return execute_query(sql, wherevalues);
	}



	static ArrayNode list__catchsolve_noiodh__test_dataset_check_name_count_records(ObjectNode filter) throws SQLException, ParseException
	{
		String sql = """
				select *
				  from catchsolve_noiodh.test_dataset_check_name_count_records_vw
				 where (? is null or dataset_name like ?)
				   and (?::timestamptz is null or session_start_ts = ?)
			    order by check_name
				""";
		ArrayList<Object> wherevalues = new ArrayList<>();
		wherevalues.add(((TextNode)filter.get("dataset_name")).textValue());
		wherevalues.add(wherevalues.get(wherevalues.size() - 1));
		wherevalues.add(jsdate2timestamp(((TextNode)filter.get("session_start_ts")).textValue()));
		wherevalues.add(wherevalues.get(wherevalues.size() - 1));
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
					JsonNode valueJson = switch (value.getClass().getName())
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

	public static String get_dataset_list() throws IOException
	{
		// https://tourism.api.opendatahub.com/v1/MetaData?pagesize=1000&origin=webcomp-datasets-list
		URL url =   URI.create("https://tourism.api.opendatahub.com/v1/MetaData?pagesize=1000&origin=webcomp-datasets-list").toURL();
		URLConnection urlc = url.openConnection();
		String json = new String(urlc.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
		return json;
	}

}
