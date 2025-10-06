// SPDX-FileCopyrightText: 2025 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later
import Keycloak from 'keycloak-js';
import { jwtDecode } from 'jwt-decode';
export class AuthComponent extends HTMLElement {
    sroot;
    keycloak;
    div_unauthenticated;
    div_authenticated;
    button_login;
    user_button;
    user_menu;
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
				<div class="user-menu">
					<button class="logout-button">Logout</button>
					<!-- Altre voci future -->
				</div>
			</div>
		`;
        this.div_unauthenticated = this.sroot.querySelector('.unauthenticated');
        this.div_authenticated = this.sroot.querySelector('.authenticated');
        this.button_login = this.sroot.querySelector('.unauthenticated button');
        this.user_button = this.sroot.querySelector('.user-button');
        this.user_menu = this.sroot.querySelector('.user-menu');
        this.keycloak = new Keycloak({
            url: "https://auth.opendatahub.testingmachine.eu/auth/",
            realm: "noi",
            clientId: "odh-data-quality-web"
        });
        this.button_login.onclick = () => {
            this.keycloak.login();
        };
        this.user_button.onclick = (e) => {
            e.stopPropagation(); // 🔥 blocca la chiusura immediata
            this.user_menu.classList.toggle('show');
        };
        const logout_button = this.sroot.querySelector('.logout-button');
        logout_button.onclick = () => {
            this.keycloak.logout();
        };
        // Listener globale per chiudere il menu se si clicca fuori
        document.addEventListener('click', (e) => {
            if (!this.sroot.contains(e.target)) {
                this.user_menu.classList.remove('show');
            }
        });
        this.refreshLoginState();
    }
    async refreshLoginState() {
        const authenticated = await this.keycloak.init({
            redirectUri: 'http://localhost:8080'
        });
        if (authenticated) {
            const token = this.keycloak.token;
            const decoded = jwtDecode(token);
            const username = decoded.preferred_username || decoded.name || 'User';
            this.user_button.textContent = `${username} ▼`;
            this.div_unauthenticated.classList.add('display-none');
            this.div_authenticated.classList.remove('display-none');
        }
        else {
            this.div_authenticated.classList.add('display-none');
            this.div_unauthenticated.classList.remove('display-none');
        }
    }
}
customElements.define('cs-auth-component', AuthComponent);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aENvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3R5cGVzY3JpcHQvQXV0aENvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4REFBOEQ7QUFDOUQsRUFBRTtBQUNGLDZDQUE2QztBQUU3QyxPQUFPLFFBQVEsTUFBTSxhQUFhLENBQUM7QUFDbkMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUV2QyxNQUFNLE9BQU8sYUFBYyxTQUFRLFdBQVc7SUFDN0MsS0FBSyxDQUFBO0lBQ0wsUUFBUSxDQUFBO0lBRVIsbUJBQW1CLENBQUE7SUFDbkIsaUJBQWlCLENBQUE7SUFFakIsWUFBWSxDQUFBO0lBQ1osV0FBVyxDQUFBO0lBQ1gsU0FBUyxDQUFBO0lBRVQ7UUFDQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3RXRCLENBQUM7UUFFRixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUUsQ0FBQztRQUN6RSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUUsQ0FBQztRQUNyRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFzQixDQUFDO1FBQzdGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFzQixDQUFDO1FBQ2pGLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFFLENBQUM7UUFFekQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQztZQUM1QixHQUFHLEVBQUUsa0RBQWtEO1lBQ3ZELEtBQUssRUFBRSxLQUFLO1lBQ1osUUFBUSxFQUFFLHNCQUFzQjtTQUNoQyxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsWUFBa0MsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFDO1FBRUQsSUFBSSxDQUFDLFdBQWlDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBYSxFQUFFLEVBQUU7WUFDbkUsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsa0NBQWtDO1lBQ3ZELElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUM7UUFFRixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBc0IsQ0FBQztRQUN0RixhQUFhLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3hCLENBQUMsQ0FBQztRQUVGLDJEQUEyRDtRQUMzRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFjLENBQUMsRUFBRSxDQUFDO2dCQUM1QyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUssQ0FBQyxpQkFBaUI7UUFDdEIsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUM5QyxXQUFXLEVBQUUsdUJBQXVCO1NBQ3BDLENBQUMsQ0FBQztRQUNILElBQUksYUFBYSxFQUFFLENBQUM7WUFDbkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFNLENBQUM7WUFDbkMsTUFBTSxPQUFPLEdBQVEsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQztZQUV0RSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxHQUFHLFFBQVEsSUFBSSxDQUFDO1lBRS9DLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7YUFBTSxDQUFDO1lBQ1AsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0QsQ0FBQztJQUNGLENBQUM7Q0FDRDtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDI1IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBR1BMLTMuMC1vci1sYXRlclxuXG5pbXBvcnQgS2V5Y2xvYWsgZnJvbSAna2V5Y2xvYWstanMnO1xuaW1wb3J0IHsgand0RGVjb2RlIH0gZnJvbSAnand0LWRlY29kZSc7XG5cbmV4cG9ydCBjbGFzcyBBdXRoQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHRzcm9vdFxuXHRrZXljbG9ha1xuXG5cdGRpdl91bmF1dGhlbnRpY2F0ZWRcblx0ZGl2X2F1dGhlbnRpY2F0ZWRcblxuXHRidXR0b25fbG9naW5cblx0dXNlcl9idXR0b25cblx0dXNlcl9tZW51XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG5cdFx0dGhpcy5zcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImluZGV4LmNzc1wiPlxuXHRcdFx0PHN0eWxlPlxuXHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0XHRmb250LWZhbWlseTogc2Fucy1zZXJpZjtcblx0XHRcdFx0fVxuXHRcdFx0XHQuZGlzcGxheS1ub25lIHtcblx0XHRcdFx0XHRkaXNwbGF5OiBub25lO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC5hdXRoLWNvbnRhaW5lciB7XG5cdFx0XHRcdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC51c2VyLWJ1dHRvbiB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZDogbm9uZTtcblx0XHRcdFx0XHRib3JkZXI6IG5vbmU7XG5cdFx0XHRcdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdFx0XHRcdGZvbnQtc2l6ZTogMXJlbTtcblx0XHRcdFx0fVxuXHRcdFx0XHQudXNlci1tZW51IHtcblx0XHRcdFx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0XHRcdFx0dG9wOiAxMDAlO1xuXHRcdFx0XHRcdHJpZ2h0OiAwO1xuXHRcdFx0XHRcdGJhY2tncm91bmQ6IHdoaXRlO1xuXHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG5cdFx0XHRcdFx0Ym94LXNoYWRvdzogMCAycHggNnB4IHJnYmEoMCwwLDAsMC4yKTtcblx0XHRcdFx0XHRkaXNwbGF5OiBub25lO1xuXHRcdFx0XHRcdG1pbi13aWR0aDogMTIwcHg7XG5cdFx0XHRcdFx0ei1pbmRleDogMTA7XG5cdFx0XHRcdH1cblx0XHRcdFx0LnVzZXItbWVudS5zaG93IHtcblx0XHRcdFx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRcdFx0fVxuXHRcdFx0XHQudXNlci1tZW51IGJ1dHRvbiB7XG5cdFx0XHRcdFx0d2lkdGg6IDEwMCU7XG5cdFx0XHRcdFx0YmFja2dyb3VuZDogbm9uZTtcblx0XHRcdFx0XHRib3JkZXI6IG5vbmU7XG5cdFx0XHRcdFx0cGFkZGluZzogOHB4IDEycHg7XG5cdFx0XHRcdFx0dGV4dC1hbGlnbjogbGVmdDtcblx0XHRcdFx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0LnVzZXItbWVudSBidXR0b246aG92ZXIge1xuXHRcdFx0XHRcdGJhY2tncm91bmQ6ICNlZWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvKiBTdGlsZSBib3R0b25lIGxvZ2luICovXG5cdFx0XHRcdC51bmF1dGhlbnRpY2F0ZWQgYnV0dG9uIHtcblx0XHRcdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcblx0XHRcdFx0XHRjb2xvcjogd2hpdGU7XG5cdFx0XHRcdFx0dGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcblx0XHRcdFx0XHRmb250LXdlaWdodDogYm9sZDtcblx0XHRcdFx0XHRib3JkZXI6IG5vbmU7XG5cdFx0XHRcdFx0cGFkZGluZzogOHB4IDE2cHg7XG5cdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogNnB4O1xuXHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHR0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0LnVuYXV0aGVudGljYXRlZCBidXR0b246aG92ZXIge1xuXHRcdFx0XHRcdGJhY2tncm91bmQtY29sb3I6ICMzMzM7XG5cdFx0XHRcdH1cblx0XHRcdDwvc3R5bGU+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidW5hdXRoZW50aWNhdGVkIGRpc3BsYXktbm9uZVwiPlxuXHRcdFx0XHQ8YnV0dG9uPkxvZ2luPC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJhdXRoZW50aWNhdGVkIGRpc3BsYXktbm9uZSBhdXRoLWNvbnRhaW5lclwiPlxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwidXNlci1idXR0b25cIj5Vc2VyIOKWvDwvYnV0dG9uPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwidXNlci1tZW51XCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImxvZ291dC1idXR0b25cIj5Mb2dvdXQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8IS0tIEFsdHJlIHZvY2kgZnV0dXJlIC0tPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdGA7XG5cblx0XHR0aGlzLmRpdl91bmF1dGhlbnRpY2F0ZWQgPSB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy51bmF1dGhlbnRpY2F0ZWQnKSE7XG5cdFx0dGhpcy5kaXZfYXV0aGVudGljYXRlZCA9IHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLmF1dGhlbnRpY2F0ZWQnKSE7XG5cdFx0dGhpcy5idXR0b25fbG9naW4gPSB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy51bmF1dGhlbnRpY2F0ZWQgYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cdFx0dGhpcy51c2VyX2J1dHRvbiA9IHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLnVzZXItYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cdFx0dGhpcy51c2VyX21lbnUgPSB0aGlzLnNyb290LnF1ZXJ5U2VsZWN0b3IoJy51c2VyLW1lbnUnKSE7XG5cblx0XHR0aGlzLmtleWNsb2FrID0gbmV3IEtleWNsb2FrKHtcblx0XHRcdHVybDogXCJodHRwczovL2F1dGgub3BlbmRhdGFodWIudGVzdGluZ21hY2hpbmUuZXUvYXV0aC9cIixcblx0XHRcdHJlYWxtOiBcIm5vaVwiLFxuXHRcdFx0Y2xpZW50SWQ6IFwib2RoLWRhdGEtcXVhbGl0eS13ZWJcIlxuXHRcdH0pO1xuXG5cdFx0KHRoaXMuYnV0dG9uX2xvZ2luIGFzIEhUTUxCdXR0b25FbGVtZW50KS5vbmNsaWNrID0gKCkgPT4ge1xuXHRcdFx0dGhpcy5rZXljbG9hay5sb2dpbigpO1xuXHRcdH07XG5cblx0XHQodGhpcy51c2VyX2J1dHRvbiBhcyBIVE1MQnV0dG9uRWxlbWVudCkub25jbGljayA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpOyAvLyDwn5SlIGJsb2NjYSBsYSBjaGl1c3VyYSBpbW1lZGlhdGFcblx0XHRcdHRoaXMudXNlcl9tZW51LmNsYXNzTGlzdC50b2dnbGUoJ3Nob3cnKTtcblx0XHR9O1xuXG5cdFx0Y29uc3QgbG9nb3V0X2J1dHRvbiA9IHRoaXMuc3Jvb3QucXVlcnlTZWxlY3RvcignLmxvZ291dC1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcblx0XHRsb2dvdXRfYnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLmtleWNsb2FrLmxvZ291dCgpO1xuXHRcdH07XG5cblx0XHQvLyBMaXN0ZW5lciBnbG9iYWxlIHBlciBjaGl1ZGVyZSBpbCBtZW51IHNlIHNpIGNsaWNjYSBmdW9yaVxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdGlmICghdGhpcy5zcm9vdC5jb250YWlucyhlLnRhcmdldCBhcyBOb2RlKSkge1xuXHRcdFx0XHR0aGlzLnVzZXJfbWVudS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLnJlZnJlc2hMb2dpblN0YXRlKCk7XG5cdH1cblxuXHRhc3luYyByZWZyZXNoTG9naW5TdGF0ZSgpIHtcblx0XHRjb25zdCBhdXRoZW50aWNhdGVkID0gYXdhaXQgdGhpcy5rZXljbG9hay5pbml0KHtcblx0XHRcdHJlZGlyZWN0VXJpOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJ1xuXHRcdH0pO1xuXHRcdGlmIChhdXRoZW50aWNhdGVkKSB7XG5cdFx0XHRjb25zdCB0b2tlbiA9IHRoaXMua2V5Y2xvYWsudG9rZW4hO1xuXHRcdFx0Y29uc3QgZGVjb2RlZDogYW55ID0gand0RGVjb2RlKHRva2VuKTtcblx0XHRcdGNvbnN0IHVzZXJuYW1lID0gZGVjb2RlZC5wcmVmZXJyZWRfdXNlcm5hbWUgfHwgZGVjb2RlZC5uYW1lIHx8ICdVc2VyJztcblxuXHRcdFx0dGhpcy51c2VyX2J1dHRvbi50ZXh0Q29udGVudCA9IGAke3VzZXJuYW1lfSDilrxgO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmRpdl91bmF1dGhlbnRpY2F0ZWQuY2xhc3NMaXN0LmFkZCgnZGlzcGxheS1ub25lJyk7XG5cdFx0XHR0aGlzLmRpdl9hdXRoZW50aWNhdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXktbm9uZScpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmRpdl9hdXRoZW50aWNhdGVkLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXktbm9uZScpO1xuXHRcdFx0dGhpcy5kaXZfdW5hdXRoZW50aWNhdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXktbm9uZScpO1xuXHRcdH1cblx0fVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWF1dGgtY29tcG9uZW50JywgQXV0aENvbXBvbmVudCk7XG4iXX0=