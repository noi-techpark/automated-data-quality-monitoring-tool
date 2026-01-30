// SPDX-FileCopyrightText: 2025 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export class CommonWebComponent extends HTMLElement {

    sroot: ShadowRoot

    constructor(html: string = '') {
        super()
        this.setAttribute('data-component-name', this.constructor.name)
        this.sroot = this.attachShadow({ mode: 'open' })
        this.sroot.innerHTML = html
        customElements.upgrade(this.sroot)
    }

    querySelector(q: string): HTMLElement {
        const e = this.sroot.querySelector(q)
        if (e === null)
            throw new Error();
        if (!(e instanceof HTMLElement))
            throw new Error();
        return e
    }

}
