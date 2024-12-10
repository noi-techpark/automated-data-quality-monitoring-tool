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
						margin: 2rem;
					}
					div.loader {
						color: #222;
					}
					
				</style>
				<div class="loader" style="margin-top: 0px; margin-left:20px"></div>
				`;
        customElements.upgrade(sroot);
    }
}
customElements.define('cs-loader', Loader);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHlwZXNjcmlwdC9Mb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsTUFBTSxPQUFPLE1BQU8sU0FBUSxXQUFXO0lBRXRDO1FBQ0MsS0FBSyxFQUFFLENBQUE7UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDakQsS0FBSyxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7OztLQWdCZixDQUFBO1FBQ0gsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUU5QixDQUFDO0NBRUQ7QUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5cbmV4cG9ydCBjbGFzcyBMb2FkZXIgZXh0ZW5kcyBIVE1MRWxlbWVudFxue1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpXG5cdFx0Y29uc3Qgc3Jvb3QgPSB0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KVxuXHRcdHNyb290LmlubmVySFRNTCA9IGBcblx0XHRcdFx0PGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJsb2FkZXIuY3NzXCI+XG5cdFx0XHRcdDxzdHlsZT5cblx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHR3aWR0aDogNjVweDtcblx0XHRcdFx0XHRcdGhlaWdodDogMTVweDtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRcdFx0XHRcdG92ZXJmbG93OiBoaWRkZW47XG5cdFx0XHRcdFx0XHRtYXJnaW46IDJyZW07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRpdi5sb2FkZXIge1xuXHRcdFx0XHRcdFx0Y29sb3I6ICMyMjI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwibG9hZGVyXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAwcHg7IG1hcmdpbi1sZWZ0OjIwcHhcIj48L2Rpdj5cblx0XHRcdFx0YFxuXHRcdGN1c3RvbUVsZW1lbnRzLnVwZ3JhZGUoc3Jvb3QpXG5cdFx0XG5cdH1cblx0XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnY3MtbG9hZGVyJywgTG9hZGVyKVxuIl19