export class Loader extends HTMLElement {
    constructor() {
        super();
        const sroot = this.attachShadow({ mode: 'open' });
        sroot.innerHTML = `
				<link rel="stylesheet" href="loader.css">
				<style>
					:host {
						width: 65px;
						height: 15px;
						display: inline-block;
						overflow: hidden;
					}
					div.loader {
						color: #888;
					}
					
				</style>
				<div class="loader" style="margin-top: 0px; margin-left:20px"></div>
				`;
        customElements.upgrade(sroot);
    }
}
customElements.define('cs-loader', Loader);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHlwZXNjcmlwdC9Mb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsTUFBTSxPQUFPLE1BQU8sU0FBUSxXQUFXO0lBRXRDO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDakQsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7O0tBZWYsQ0FBQTtRQUNILGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFOUIsQ0FBQztDQUVEO0FBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuXG5leHBvcnQgY2xhc3MgTG9hZGVyIGV4dGVuZHMgSFRNTEVsZW1lbnRcbntcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKVxuXHRcdGNvbnN0IHNyb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSlcblx0XHRzcm9vdC5pbm5lckhUTUwgPSBgXG5cdFx0XHRcdDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwibG9hZGVyLmNzc1wiPlxuXHRcdFx0XHQ8c3R5bGU+XG5cdFx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdFx0d2lkdGg6IDY1cHg7XG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDE1cHg7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cdFx0XHRcdFx0XHRvdmVyZmxvdzogaGlkZGVuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRkaXYubG9hZGVyIHtcblx0XHRcdFx0XHRcdGNvbG9yOiAjODg4O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PGRpdiBjbGFzcz1cImxvYWRlclwiIHN0eWxlPVwibWFyZ2luLXRvcDogMHB4OyBtYXJnaW4tbGVmdDoyMHB4XCI+PC9kaXY+XG5cdFx0XHRcdGBcblx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHNyb290KVxuXHRcdFxuXHR9XG5cdFxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NzLWxvYWRlcicsIExvYWRlcilcbiJdfQ==