/*
 * (C) 2024 Catch Solve di Davide Montesin
 * License: AGPL
 */
import { Component } from './Component.js';
export class MenuElement extends Component {
    constructor() {
        super();
        const menu1 = document.createElement('div');
        menu1.textContent = ("standard dashboards");
        this.element.appendChild(menu1);
        const menu1_submenus = document.createElement('div');
        menu1_submenus.className = ("menu1_submenus");
        this.element.appendChild(menu1_submenus);
        for (let i = 0; i < 10; i++) {
            const menu1_submenu = document.createElement('div');
            menu1_submenu.textContent = ("dashboard" + i);
            menu1_submenus.appendChild(menu1_submenu);
        }
        /*
        const menu2 = document.createElement('div');
        menu2.textContent = ("my dashboards");
        
        this.element.appendChild(menu2)
         */
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVudUVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90eXBlc2NyaXB0L01lbnVFbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQTtBQUV4QyxNQUFNLE9BQU8sV0FBWSxTQUFRLFNBQVM7SUFFekM7UUFFQyxLQUFLLEVBQUUsQ0FBQztRQUNSLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRCxjQUFjLENBQUMsU0FBUyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV6QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUMzQixDQUFDO1lBQ0EsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwRCxhQUFhLENBQUMsV0FBVyxHQUFHLENBQUMsV0FBVyxHQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLGNBQWMsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUVEOzs7OztXQUtHO0lBQ0osQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIChDKSAyMDI0IENhdGNoIFNvbHZlIGRpIERhdmlkZSBNb250ZXNpblxuICogTGljZW5zZTogQUdQTFxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50fSBmcm9tICcuL0NvbXBvbmVudC5qcydcblxuZXhwb3J0IGNsYXNzIE1lbnVFbGVtZW50IGV4dGVuZHMgQ29tcG9uZW50XG57XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cdFx0Y29uc3QgbWVudTEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRtZW51MS50ZXh0Q29udGVudCA9IChcInN0YW5kYXJkIGRhc2hib2FyZHNcIik7XG5cdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG1lbnUxKTtcblx0XHRjb25zdCBtZW51MV9zdWJtZW51cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdG1lbnUxX3N1Ym1lbnVzLmNsYXNzTmFtZSA9IChcIm1lbnUxX3N1Ym1lbnVzXCIpO1xuXHRcdHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChtZW51MV9zdWJtZW51cyk7XG5cdFx0XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKVxuXHRcdHtcblx0XHRcdGNvbnN0IG1lbnUxX3N1Ym1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdG1lbnUxX3N1Ym1lbnUudGV4dENvbnRlbnQgPSAoXCJkYXNoYm9hcmRcIitpKTtcblx0XHRcdG1lbnUxX3N1Ym1lbnVzLmFwcGVuZENoaWxkKG1lbnUxX3N1Ym1lbnUpO1xuXHRcdH1cblxuXHRcdC8qXG5cdFx0Y29uc3QgbWVudTIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRtZW51Mi50ZXh0Q29udGVudCA9IChcIm15IGRhc2hib2FyZHNcIik7XG5cdFx0XG5cdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG1lbnUyKVxuXHRcdCAqL1xuXHR9XG59XG4iXX0=