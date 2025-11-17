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
import java.text.ParseException;
import java.util.ArrayList;

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
			// ArrayList<String> user_odh_roles = APIServlet.readAllowedODHUserRoles(req);
			APIHelper.processRequest(req, resp);
		} catch (Exception exxx) {
			throw new ServletException(exxx);
		}
	}

	private ArrayList<String> readAllowedODHUserRoles(HttpServletRequest req)
			throws ParseException, MalformedURLException, URISyntaxException, BadJOSEException, JOSEException {

		ArrayList<String> user_odh_roles = new ArrayList<String>();
		String authorizationHeader = req.getHeader("Authorization");
		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
			return user_odh_roles;
		}
		String token = authorizationHeader.substring("Bearer ".length()).trim();

		SignedJWT signedJWT = SignedJWT.parse(token);
		State state = signedJWT.getState();

		System.out.println("State: " + state.name());

		JWTClaimsSet claim = this.jwtProcessor.process(signedJWT, null);

		// claim.get

		// Header
		System.out.println("Header: " + signedJWT.getHeader());

		// Payload
		System.out.println("Payload: " + signedJWT.getPayload());

		// Claims
		System.out.println("Claims: " + signedJWT.getJWTClaimsSet());

		// RSASSAVerifier verifier = new RSASSAVerifier(publicKey);

		// boolean valid = token..verify(verifier);

		return new ArrayList<String>();
	}
}
