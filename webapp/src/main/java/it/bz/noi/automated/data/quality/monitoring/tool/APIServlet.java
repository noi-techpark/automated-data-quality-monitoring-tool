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
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Base64;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSObject.State;
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
			ArrayList<String> user_odh_roles = this.readAllowedODHUserRoles(req);
			APIHelper.processRequest(req, resp, user_odh_roles);
		} catch (Exception exxx) {
			throw new ServletException(exxx);
		}
	}

	private ArrayList<String> readAllowedODHUserRoles(HttpServletRequest req)
			throws ParseException, MalformedURLException, URISyntaxException, BadJOSEException, JOSEException, JsonMappingException, JsonProcessingException {
			ArrayList<String> user_odh_roles = new ArrayList<String>();
		String authorizationHeader = req.getHeader("Authorization");
		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
			return user_odh_roles;
		}
		String token = authorizationHeader.substring("Bearer ".length()).trim();
	
		SignedJWT signedJWT = SignedJWT.parse(token);
		State state = signedJWT.getState();

		// validate token and some basic default checks on claims
		JWTClaimsSet claim = this.jwtProcessor.process(signedJWT, null);

		ObjectMapper objectMapper = new ObjectMapper();
		ObjectNode claimsJson = objectMapper.readValue(claim.toString(), ObjectNode.class);

		// Object resource_access = claim.getClaim("resource_access");
		ObjectNode resource_access = (ObjectNode) claimsJson.get("resource_access");

		resource_access.fields().forEachRemaining(entry -> {
			System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue());
			JsonNode value = entry.getValue();
			if (value instanceof ObjectNode) {
				ArrayNode roles = (ArrayNode) value.get("roles");
				for (int r = 0; r < roles.size(); r++) {
					String role = roles.get(r).asText();
					user_odh_roles.add(role);
				}
			}
		});

		return user_odh_roles;
	}
}
