// SPDX-FileCopyrightText: 2025 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from './CommonWebComponent.js'
import template from './CustomDatasetFormQualityCheck.html?raw'
import type { AutoComplete, OptionItem } from './AutoComplete.js'
import { SelectedFieldType } from './CustomDatasetForm.js'


function get_field_name_type(fieldName: string): string {
    return fieldName.trim().length === 0
        ? ''
        : ((JSON.parse(fieldName) as SelectedFieldType).type as string)
}

function get_field_name_is_array(fieldName: string): boolean {
    return fieldName.trim().length === 0
        ? false
        : (JSON.parse(fieldName) as SelectedFieldType).is_array
}

function get_operation_items(fieldName: string): OptionItem[] {
    const options: OptionItem[] = []

    if (get_field_name_is_array(fieldName)) {
        options.push(
            {
                value: 'in list',
                label: 'in list'
            },
            {
                value: 'not in list',
                label: 'not in list'
            }
        )
    } else {
        options.push(
            {
                value: '=',
                label: '='
            },
            {
                value: '!=',
                label: '!='
            }
        )

        switch (get_field_name_type(fieldName)) {
            case 'string':
                options.push({ value: 'contains', label: 'contains' })
                options.push({ value: 'not contains', label: 'not contains' })
                break
            case 'number':
                options.push({ value: '<=', label: '<=' })
                options.push({ value: '>=', label: '>=' })
                break
        }
    }

    return options
}

function get_compare_value_placeholder(fieldName: string): string {
    return get_field_name_is_array(fieldName)
        ? 'list of values separated by , (csv)'
        : 'comparison value of type ' + get_field_name_type(fieldName)
}

function isvalid_state(fieldName: string, operation: string, compareValue: string): boolean {
    return fieldName.trim() !== '' && operation !== '' && compareValue.trim() !== ''
}

export class CustomDatasetFormQualityCheck extends CommonWebComponent
{
    #state = {
        field_name: '',
        operation: '',
        compare_value: ''
    }
    #onchange: () => void = () => {}
    #compareInput: HTMLInputElement
    #mainRow: HTMLElement
    #fieldName: AutoComplete
    #fieldNameType: HTMLElement
    #fieldNameIsArray: HTMLElement
    #operation: AutoComplete

    #isvalid: boolean

    constructor()
    {
        super(template)

        this.#mainRow = this.querySelector('.maindiv')
        this.#fieldName = this.querySelector('.field-name') as AutoComplete
        this.#fieldNameType = this.querySelector('.field-name-type')
        this.#fieldNameIsArray = this.querySelector('.field-name-is-array')
        this.#operation = this.querySelector('.operation') as AutoComplete
        this.#compareInput = this.querySelector('.compare-value') as HTMLInputElement

        this.#setupUiEffects()
        this.#isvalid = false
        this.#resync_derived_resources()
    }

    #setupUiEffects()
    {
        this.#fieldName.onchange = () => {
            this.value_field_name = this.#fieldName.value
            this.#onchange()
        }
        this.#operation.onchange = () => {
            this.value_operation = this.#operation.value
            this.#onchange()

        }
        this.#compareInput.addEventListener('input', () => {
            this.value_compare_value = this.#compareInput.value
            this.#onchange()
        })
    }

    #resync_derived_resources(): void {
        this.#fieldName.value = this.#state.field_name
        this.#fieldNameType.textContent = get_field_name_type(this.#fieldName.value)
        this.#fieldNameIsArray.textContent = String(get_field_name_is_array(this.#fieldName.value))
        this.#operation.items = get_operation_items(this.#fieldName.value)
        this.#operation.value = this.#state.operation
        this.#compareInput.value = this.#state.compare_value
        this.#compareInput.placeholder = get_compare_value_placeholder(this.#fieldName.value)

        const isvalid = isvalid_state(this.#fieldName.value, this.#operation.value, this.#compareInput.value)
        this.#mainRow.classList.toggle('isnotvalid', !isvalid)

        this.#isvalid = isvalid
    }

    set value_field_name(v: string) {
        if (this.#state.field_name === v)
            return
        this.#state.field_name = v
        this.#resync_derived_resources()
    }

    set value_operation(v: string) {
        if (this.#state.operation === v)
            return
        this.#state.operation = v
        this.#resync_derived_resources()
    }

    set value_compare_value(v: string) {
        if (this.#state.compare_value === v)
            return
        this.#state.compare_value = v
        this.#resync_derived_resources()
    }

    get value_field_name() {
        return this.#state.field_name
    }

    get value_operation() {
       return  this.#state.operation
    }

    get value_compare_value() {
        return this.#state.compare_value
    }

    get isvalid() {
        return this.#isvalid
    }

    
    set items(values: OptionItem[]) {
        const current = this.#fieldName.items
        if (current !== undefined && current.length === values.length) {
            let same = true
            for (let i = 0; i < current.length; i++) {
                const a = current[i]
                const b = values[i]
                if (a.value !== b.value || a.label !== b.label) {
                    same = false
                    break
                }
            }
            if (same)
                return
        }
        this.#fieldName.items = values
        this.#resync_derived_resources()
    }

    set onchange(fn: () => void) {
        this.#onchange = fn
    }

    get delete_button() {
        return this.querySelector('button')
    }

}

customElements.define('cs-custom-dataset-form-quality-check', CustomDatasetFormQualityCheck)
