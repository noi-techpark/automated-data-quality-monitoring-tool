// SPDX-FileCopyrightText: 2025 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from './CommonWebComponent.js';
import { jwtDecode } from 'jwt-decode';
import { kc } from './auth.js';
import { API3 } from './api/api3.js';
import template from './AuthComponent.html?raw'


export class AuthComponent extends CommonWebComponent {

	div_unauthenticated
	div_authenticated

	button_login
	user_button
	user_label
	user_menu

	select_role

	constructor() {
		super(template);

		this.div_unauthenticated = this.sroot.querySelector('.unauthenticated')!;
		this.div_authenticated = this.sroot.querySelector('.authenticated')!;
		this.button_login = this.sroot.querySelector('.unauthenticated button') as HTMLButtonElement;
		this.user_button = this.sroot.querySelector('.user-button') as HTMLButtonElement;
		this.user_label = this.sroot.querySelector('.user-label') as HTMLSpanElement;
		this.user_menu = this.sroot.querySelector('.user-menu')!;

		(this.button_login as HTMLButtonElement).onclick = async () => {
			kc.login();
		};

		(this.user_button as HTMLButtonElement).onclick = (e: MouseEvent) => {
			e.stopPropagation(); // 🔥 blocks immediate closure
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
		if (kc.authenticated) {
			const token = kc.token!;
			const decoded: any = jwtDecode(token);
			const username = decoded.preferred_username || decoded.name || 'User';
			this.user_label.textContent = username;
			
			this.div_unauthenticated.classList.add('display-none');
			this.div_authenticated.classList.remove('display-none');
			const roles = await API3.get_auth_user_roles();
			this.select_role.textContent = '';
			for (const role of roles) {
				const option = document.createElement('option');
				option.value = role;
				option.textContent = role;
				this.select_role.appendChild(option);
			}
			this.select_role.value = sessionStorage.getItem('used_key_role')!
		} else {
			this.div_authenticated.classList.add('display-none');
			this.div_unauthenticated.classList.remove('display-none');
		}
	}
}

customElements.define('cs-auth-component', AuthComponent);
