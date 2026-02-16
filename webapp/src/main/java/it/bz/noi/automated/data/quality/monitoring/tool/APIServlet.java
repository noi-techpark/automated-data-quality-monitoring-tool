// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */

package it.bz.noi.automated.data.quality.monitoring.tool;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.JWKSourceBuilder;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class APIServlet extends HttpServlet {

	private ConfigurableJWTProcessor<SecurityContext> jwtProcessor;

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		try {
			Class.forName("org.postgresql.Driver");
			JWKSource<SecurityContext> keySource = JWKSourceBuilder
					.create(new URI(
							"https://auth.opendatahub.com/auth/realms/noi/protocol/openid-connect/certs").toURL())
					.retrying(true)
					.build();

			
			// JWSKeySelector<SecurityContext> keySelector = new JWSAlgorithmFamilyJWSKeySelector<>(JWSAlgorithm.Family.RSA, keySource);
			JWSKeySelector<SecurityContext> keySelector = new JWSVerificationKeySelector<>(JWSAlgorithm.RS256, keySource);

			this.jwtProcessor = new DefaultJWTProcessor<>();
			jwtProcessor.setJWSKeySelector(keySelector);

			// This is already done by default
			// jwtProcessor.setJWTClaimsSetVerifier(new DefaultJWTClaimsVerifier<>());
			// jwtProcessor.setJWSTypeVerifier(new DefaultJOSEObjectTypeVerifier<>(new JOSEObjectType("JWT")));

		} catch (ClassNotFoundException | URISyntaxException | MalformedURLException e) {
			throw new ServletException(e);
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		try {
			resp.addHeader("Access-Control-Allow-Origin", "*");
			UserAuthInfo userAuth = this.readAllowedODHUserRoles(req);
			APIHelper.processRequest(req, resp, userAuth);
		} catch (Exception exxx) {
			throw new ServletException(exxx);
		}
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		try
		{
			resp.addHeader("Access-Control-Allow-Origin", "*");
			UserAuthInfo userAuth = this.readAllowedODHUserRoles(req);
			String action = req.getParameter("action");
			switch (action)
			{
				case "insert_custom_dashboard":
						String test_definition_json = req.getParameter("test_definition_json");
						insert_custom_dashboard(userAuth, test_definition_json);
					break;
				case "delete_custom_dashboard":
						String id = req.getParameter("id");
						delete_custom_dashboard(userAuth, id);
					break;
			}
		}
		catch(Exception e)
		{
			throw new ServletException(e);
		}
	}

	private void insert_custom_dashboard(UserAuthInfo userAuth, String test_definition_json) throws SQLException {
		try (Connection conn = DriverManager.getConnection(System.getenv("JDBC_URL")))
		{
			ObjectNode payload;
			try {
				payload = (ObjectNode)new ObjectMapper().readTree(test_definition_json);
			} catch (JsonProcessingException e) {
				throw new SQLException("Invalid test_definition_json payload", e);
			}
			long id = payload.get("id").asLong();
			String userId = userAuth.getSub();
			String userRole = userAuth.getCurrentRole();
			String name = payload.path("name").asText();
			JsonNode testDefinitionNode = payload.get("test_definition_json");
			String testDefinition = testDefinitionNode == null ? null : testDefinitionNode.toString();
			try (PreparedStatement pstmt = conn.prepareStatement(""" 
				insert into catchsolve_noiodh.custom_dashboards
					(id, user_id, user_role, name, test_definition_json)
				values (?,?,?,?,?)
				on conflict (id) do update
					set user_id = excluded.user_id,
						user_role = excluded.user_role,
						name = excluded.name,
						test_definition_json = excluded.test_definition_json
			""")) {
				pstmt.setLong(1, id);
				pstmt.setString(2, userId);
				pstmt.setString(3, userRole);
				pstmt.setString(4, name);
				pstmt.setString(5, testDefinition);
				pstmt.executeUpdate();
			}
		}
	}

	private void delete_custom_dashboard(UserAuthInfo userAuth, String id) throws SQLException {
		if (userAuth.isAnonymous())
			return;
		long dashboardId = Long.parseLong(id);
		try (Connection conn = DriverManager.getConnection(System.getenv("JDBC_URL")))
		{
			String userId = userAuth.getSub();
			String userRole = userAuth.getCurrentRole();
			try (PreparedStatement pstmt = conn.prepareStatement(""" 
				delete from catchsolve_noiodh.custom_dashboards
				 where id = ? and user_id = ? and user_role = ?
			""")) {
				pstmt.setLong(1, dashboardId);
				pstmt.setString(2, userId);
				pstmt.setString(3, userRole);
				pstmt.executeUpdate();
			}
		}
	}

	public static final class UserAuthInfo {
		private final ArrayList<String> roles;
		private final String sub;
		private final String currentRole;

		private UserAuthInfo(ArrayList<String> roles, String sub, String currentRole) {
			this.roles = roles;
			this.sub = sub;
			boolean isValidRole = "opendata".equals(currentRole)
					|| (currentRole != null && roles.contains(currentRole));
			if (!isValidRole)
				throw new IllegalStateException(currentRole);
			this.currentRole = currentRole;
		}

		public ArrayList<String> getRoles()
		{
			return this.roles;
		}

		public boolean isAnonymous()
		{
			return this.sub == null;
		}

		public String getSub()
		{
			return this.sub;
		}

		public String getCurrentRole()
		{
			return this.currentRole;
		}
	}

	private UserAuthInfo readAllowedODHUserRoles(HttpServletRequest req)
			throws ParseException, BadJOSEException, JOSEException, JsonProcessingException {
		String currentRole = req.getParameter("current_role");
		String authorizationHeader = req.getHeader("Authorization");
		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
			ArrayList<String> user_odh_roles = new ArrayList<>(1);
			user_odh_roles.add("opendata");
			return new UserAuthInfo(user_odh_roles, null, currentRole);
		}
		String token = authorizationHeader.substring("Bearer ".length()).trim();
	
		SignedJWT signedJWT = SignedJWT.parse(token);

		// validate token and some basic default checks on claims
		JWTClaimsSet claim = this.jwtProcessor.process(signedJWT, null);

		ArrayList<String> user_odh_roles = new ArrayList<String>();

		String sub = claim.getSubject();
		Object resourceAccessObj = claim.getClaim("resource_access");
		if (resourceAccessObj instanceof Map<?, ?> resourceAccess) {
			for (Object valueObj : resourceAccess.values()) {
				if (valueObj instanceof Map<?, ?> valueMap) {
					Object rolesObj = valueMap.get("roles");
					if (rolesObj instanceof Iterable<?> rolesList) {
						for (Object roleObj : rolesList) {
							if (roleObj != null) {
								user_odh_roles.add(roleObj.toString());
							}
						}
					}
				}
			}
		}

		return new UserAuthInfo(user_odh_roles, sub, currentRole);
	}
}
