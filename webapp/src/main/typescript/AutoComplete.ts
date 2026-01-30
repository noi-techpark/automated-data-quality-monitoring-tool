// SPDX-FileCopyrightText: 2025 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from "./CommonWebComponent.js";
import template from './AutoComplete.html?raw'

export type OptionItem = {
  value: string
  label: string
}

type OptionListState = 'force-off' | 'filtered_by_input_value' | 'force-all'

type AutoCompleteState = {
  option_list_state: OptionListState
  hasfocus: boolean
  items: OptionItem[]
  value_on_focus: string | null
  value_of_input: string
  selected_value: string
}

const findValueByLabel = (label: string, list: readonly OptionItem[]): string => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].label === label)
      return list[i].value
  }
  return ''
}

const items_filtered = (
  option_list_state: OptionListState,
  items: OptionItem[],
  value_of_input: string
): OptionItem[] => {
  const stateVal = option_list_state
  if (stateVal === 'force-off')
    return []
  const result: OptionItem[] = []
  if (stateVal === 'force-all') {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      result.push({
        label: item.label,
        value: item.value,
      })
    }
    return result
  }
  const current = value_of_input.toLowerCase()
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (!item.label.toLowerCase().includes(current))
      continue
    result.push(item)
  }
  return result
}

const isvalid = (value_of_input: string, items: OptionItem[]): boolean => {
  return findValueByLabel(value_of_input, items) !== ''
}

const list_hidden = (option_list_state: OptionListState): boolean => {
  return option_list_state === 'force-off'
}

const hide_nooptions = (option_list_state: OptionListState, filtered_count: number): boolean => {
  return !(option_list_state === 'filtered_by_input_value' && filtered_count === 0)
}

const class_invalid = (value_of_input: string, items: OptionItem[]): boolean => {
  return !isvalid(value_of_input, items)
}

const class_empty_value = (value_of_input: string): boolean => {
  return value_of_input.trim().length === 0
}

export type AutoCompleteTestingHtmlElements = {
    readonly input_filter: HTMLInputElement
    readonly button_showoptions: HTMLElement
    readonly options: () => { readonly el: HTMLElement, readonly value: string }[]
}


export class AutoComplete extends CommonWebComponent {
  #stateLogic: AutoCompleteState
  #onchange: () => void = () => {}
  #inputEl: HTMLInputElement
  #listEl: HTMLElement
  #opencloseEl: HTMLElement
  #noOptionsEl: HTMLElement
  #optionsContainer: HTMLElement
  #optionTemplate: HTMLElement

  constructor() {
    super(template);

    this.#inputEl = this.querySelector('input') as HTMLInputElement
    this.#listEl = this.querySelector('.list')
    this.#opencloseEl = this.querySelector('.openclose')
    this.#noOptionsEl = this.#listEl.querySelector('.nooptions') as HTMLElement

    this.#optionsContainer = this.querySelector('.option')
    this.#optionTemplate = this.#optionsContainer.removeChild(this.#optionsContainer.firstElementChild!) as HTMLElement

    this.#stateLogic = {
      option_list_state: 'force-off',
      hasfocus: false,
      items: [],
      value_on_focus: null,
      value_of_input: '',
      selected_value: '',
    }

    this.#opencloseEl.onmousedown = (e) => e.preventDefault()
    this.#listEl.onmousedown = (e) => e.preventDefault()

    this.#inputEl.addEventListener('input', () => {
      this.#onchange_input(this.#inputEl.value)
    })
    this.#inputEl.addEventListener('focus', () => {
      this.#onfocus_input()
    })
    this.#inputEl.addEventListener('blur', () => {
      this.#onblur_input()
    })

    this.#opencloseEl.onclick = () => {
      this.#onclick_openclose()
    }

    this.#resync_derived_resources()
  }

  #onchange_input(value: string) {
    const state = this.#stateLogic
    state.value_of_input = value
    state.option_list_state = 'filtered_by_input_value'
    const label_matching_value = findValueByLabel(state.value_of_input, state.items)
    if (label_matching_value !== undefined)
      state.selected_value = label_matching_value
    this.#resync_derived_resources()
  }

  #onclick_openclose() {
    const state = this.#stateLogic
    if (state.hasfocus) {
      state.option_list_state = state.option_list_state === 'force-off' ? 'force-all' : 'force-off'
    } else {
      state.option_list_state = 'force-all'
      this.#inputEl.focus()
    }
    this.#resync_derived_resources()
  }

  #onfocus_input() {
    const state = this.#stateLogic
    state.hasfocus = true
    state.value_on_focus = state.value_of_input
    if (!isvalid(state.value_of_input, state.items) || state.value_of_input === '')
      state.option_list_state = 'force-all'
    this.#resync_derived_resources()
  }

  #onblur_input() {
    const state = this.#stateLogic
    state.hasfocus = false
    const list = items_filtered(state.option_list_state, state.items, state.value_of_input)
    if (list.length === 1)
    {
      state.value_of_input = list[0].label
      state.selected_value = list[0].value
    }
    state.option_list_state = 'force-off'
    if (state.value_of_input !== state.value_on_focus)
      this.#onchange()
    state.value_on_focus = null
    this.#resync_derived_resources()
  }

  #onclick_item(index: number) {
    const state = this.#stateLogic
    const list = items_filtered(state.option_list_state, state.items, state.value_of_input)
    if (index < 0 || index >= list.length)
      return
    const value = list[index]
    state.selected_value = value.value
    state.value_of_input = value.label
    state.value_on_focus = value.label
    state.option_list_state = 'force-off'
    this.#onchange()
    this.#resync_derived_resources()
  }

  set onchange(c: () => void) {
    this.#onchange = c
  }

  public batchUpdate() {
    let committed = false
    let modified = false
    const builder = {
      items: (values: OptionItem[]) => {
        const state = this.#stateLogic
        const prev = state.items
        if (prev === values)
          return builder
        if (prev.length === values.length) {
          let same = true
          for (let i = 0; i < prev.length; i++) {
            if (prev[i].value !== values[i].value || prev[i].label !== values[i].label) {
              same = false
              break
            }
          }
          if (same)
            return builder
        }
        state.items = values
        const found = state.items.filter((f) => f.value === state.selected_value)
        if (found.length === 1)
          state.value_of_input = found[0].label
        else
          state.value_of_input = ''
        modified = true
        return builder
      },
      value: (v: string) => {
        const state = this.#stateLogic
        if (state.selected_value === v)
          return builder
        state.selected_value = v
        const found = state.items.filter((f) => f.value === state.selected_value)
        if (found.length === 1)
          state.value_of_input = found[0].label
        else
          state.value_of_input =  ''
        modified = true
        return builder
      },
      commit: () => {
        if (committed)
          return
        committed = true
        if (!modified)
          return
        this.#resync_derived_resources()
      },
    }
    return builder
  }

  set items(values: OptionItem[]) {
    this.batchUpdate().items(values).commit()
  }

  get value(): string {
    if (!isvalid(this.#stateLogic.value_of_input, this.#stateLogic.items))
      return ''
    return this.#stateLogic.selected_value
  }

  get isvalid(): boolean {
    return isvalid(this.#stateLogic.value_of_input, this.#stateLogic.items)
  }

  set value(v: string) {
    this.batchUpdate().value(v).commit()
  }

  public testing_htmlelements(): AutoCompleteTestingHtmlElements {
    return {
      input_filter: this.#inputEl,
      button_showoptions: this.#opencloseEl,
      options: () => {
        return Array.from(this.#optionsContainer.children).map((e) => ({ 
          el:e as HTMLElement,
          value: '' }))
      }
    }
  }

  #resync_derived_resources(): void {
    const state = this.#stateLogic
    const itemsFiltered = items_filtered(state.option_list_state, state.items, state.value_of_input)
    const isValid = isvalid(state.value_of_input, state.items)
    const listHidden = list_hidden(state.option_list_state)
    const hideNoOptions = hide_nooptions(state.option_list_state, itemsFiltered.length)
    const classInvalid = class_invalid(state.value_of_input, state.items)
    const classEmptyValue = class_empty_value(state.value_of_input)
    void isValid

    this.#inputEl.value = state.value_of_input

    this.#listEl.classList.toggle('display-none', listHidden)
    this.classList.toggle('invalid', classInvalid)
    this.classList.toggle('empty-value', classEmptyValue)
    this.#noOptionsEl.classList.toggle('display-none', hideNoOptions)

    const optionsFragment = document.createDocumentFragment()
    for (let i = 0; i < itemsFiltered.length; i++) {
      const v = itemsFiltered[i]
      const e = this.#optionTemplate.cloneNode(true) as HTMLElement
      e.textContent = v.label
      e.setAttribute('data-testid', 'option-' + v.value)
      e.onclick = () => {
        this.#onclick_item(i)
      }
      optionsFragment.appendChild(e)
    }
    this.#optionsContainer.replaceChildren(optionsFragment)
  }
}

customElements.define("cs-auto-complete", AutoComplete);
