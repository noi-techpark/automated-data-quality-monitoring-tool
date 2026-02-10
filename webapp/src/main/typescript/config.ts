// SPDX-FileCopyrightText: 2025 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// Configuration module for environment variables used in the frontend.
// Vite exposes variables prefixed with VITE_ via import.meta.env.
// This file provides typed constants with sensible defaults.

// Vite does not provide typings for `import.meta.env` out of the box. We cast to `any` to avoid
// TypeScript errors while still allowing the values to be injected at build time.
const env = (import.meta as any).env ?? {};

export const KEYCLOAK_URL = (env.VITE_KEYCLOAK_URL as string) ?? "https://auth.opendatahub.com/auth/";
export const KEYCLOAK_REALM = (env.VITE_KEYCLOAK_REALM as string) ?? "noi";

export const TOURISM_API_BASE = (env.VITE_TOURISM_API_BASE as string) ?? "https://tourism.api.opendatahub.com";
export const MOBILITY_API_BASE = (env.VITE_MOBILITY_API_BASE as string) ?? "https://mobility.api.opendatahub.com";
// Base URL for the backend API. In development the Vite proxy will forward requests, but the
// environment variable allows overriding the target (e.g., when deploying).
export const API_BASE = (env.VITE_API_BASE as string) ?? "";

// Additional configuration variables can be added here following the same pattern.
