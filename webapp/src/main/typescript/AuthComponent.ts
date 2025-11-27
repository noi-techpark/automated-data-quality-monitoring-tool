// SPDX-FileCopyrightText: 2025 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { jwtDecode } from 'jwt-decode';
import { kc } from './auth.js';


export class AuthComponent extends HTMLElement {
	sroot
	

	div_unauthenticated
	div_authenticated

	button_login
	user_button
	user_menu

	select_role

	constructor() {
		super();
		this.sroot = this.attachShadow({ mode: 'open' });
		this.sroot.innerHTML = `
			<link rel="stylesheet" href="index.css">
			<style>
				:host {
					position: relative;
					display: inline-block;
					font-family: sans-serif;
				}
				.display-none {
					display: none;
				}
				.auth-container {
					position: relative;
				}
				.user-button {
					background: none;
					border: none;
					cursor: pointer;
					font-size: 1rem;
				}
				.user-menu {
					position: absolute;
					top: 100%;
					right: 0;
					background: white;
					border: 1px solid #ccc;
					box-shadow: 0 2px 6px rgba(0,0,0,0.2);
					display: none;
					min-width: 120px;
					z-index: 10;
				}
				.user-menu.show {
					display: block;
				}
				.user-menu button {
					width: 100%;
					background: none;
					border: none;
					padding: 8px 12px;
					text-align: left;
					cursor: pointer;
				}
				.user-menu button:hover {
					background: #eee;
				}

				/* Stile bottone login */
				.unauthenticated button {
					background-color: black;
					color: white;
					text-transform: uppercase;
					font-weight: bold;
					border: none;
					padding: 8px 16px;
					border-radius: 6px;
					cursor: pointer;
					transition: background-color 0.2s;
				}
				.unauthenticated button:hover {
					background-color: #333;
				}
			</style>
			<div class="unauthenticated display-none">
				<button>Login</button>
			</div>
			<div class="authenticated display-none auth-container">
				<button class="user-button">User ▼</button>
				<select>
					<option value="opendata">opendata</option>
					<option value="idm">IDM</option>
					<option value="blc">BPM_BLC</option>
				</select>
				<div class="user-menu">
					<button class="logout-button">Logout</button>
					<!-- Altre voci future -->
				</div>
			</div>
		`;

		this.div_unauthenticated = this.sroot.querySelector('.unauthenticated')!;
		this.div_authenticated = this.sroot.querySelector('.authenticated')!;
		this.button_login = this.sroot.querySelector('.unauthenticated button') as HTMLButtonElement;
		this.user_button = this.sroot.querySelector('.user-button') as HTMLButtonElement;
		this.user_menu = this.sroot.querySelector('.user-menu')!;

		(this.button_login as HTMLButtonElement).onclick = async () => {
			kc.login();
		};

		(this.user_button as HTMLButtonElement).onclick = (e: MouseEvent) => {
			e.stopPropagation(); // 🔥 blocca la chiusura immediata
			this.user_menu.classList.toggle('show');
		};

		const logout_button = this.sroot.querySelector('.logout-button') as HTMLButtonElement;
		logout_button.onclick = async () => {
			kc.logout();
		};

		// Listener globale per chiudere il menu se si clicca fuori
		document.addEventListener('click', (e) => {
			if (!this.sroot.contains(e.target as Node)) {
				this.user_menu.classList.remove('show');
			}
		});

		this.select_role = this.sroot.querySelector('select') as HTMLSelectElement;

		this.select_role.onchange = (e) => {
			const selected_role = (e.target as HTMLSelectElement).value;
			sessionStorage.setItem('used_key_role', selected_role);
			location.reload(); // ricarica la pagina per applicare il nuovo ruolo
		};

		this.refreshLoginState();
	}

	async refreshLoginState() {
		/*
		const authenticated = await keycloak.init({
			redirectUri: 'http://localhost:8080'
		});
		 */
		if (kc.authenticated) {
			const token = kc.token!;
			const decoded: any = jwtDecode(token);
			const username = decoded.preferred_username || decoded.name || 'User';
			this.user_button.textContent = `${username} ▼`;
			
			this.div_unauthenticated.classList.add('display-none');
			this.div_authenticated.classList.remove('display-none');
			this.select_role.value = sessionStorage.getItem('used_key_role')!;
		} else {
			this.div_authenticated.classList.add('display-none');
			this.div_unauthenticated.classList.remove('display-none');
		}
	}
}

customElements.define('cs-auth-component', AuthComponent);
