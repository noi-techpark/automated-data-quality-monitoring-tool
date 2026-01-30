// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CommonWebComponent } from './CommonWebComponent.js'
import template from './CustomDatasetForm.html?raw'

import './AutoComplete.js'
import './CustomDatasetFormQualityCheck.js'
import { AutoComplete } from './AutoComplete.js'
import type { OptionItem } from './AutoComplete.js'
import { CustomDatasetFormQualityCheck } from './CustomDatasetFormQualityCheck.js'
import { TOURISM_API_BASE, MOBILITY_API_BASE } from './config.js';


export type FieldMeta = {
    field_name: string,
    description: string,
    type: 'string'|'array'|'object'|'number'|'integer'|'boolean'|'oauth2'
    nullable: true|undefined
}

export type SelectedFieldType = {
    name: string
    type: FieldMeta['type']
    is_array: boolean
}

const ALL_DATA_PROVIDERS = '--- ALL ---'

type DatasetItem = {
    Id: string
    Shortname: string
    DataProvider: string[]
    ApiType: string
    ApiUrl: string
    PathParam: string[]
}

type DatasetsOpenapi = {
    paths: {
        [path: string]: {
            get: {
                responses: {
                    200: {
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    components: {
        schemas: Schemas
    }
}

type Schemas = {
    [schema: string]: {
        properties: {
            [property: string]: {
                description: string
                type: 'string' | 'array' | 'object' | 'number' | 'integer' | 'boolean' | 'oauth2'
                nullable: true | undefined
                additionalProperties: { $ref: string | undefined }
                items: { $ref: string; type: 'string' | 'object' }
                $ref: string
            }
        }
    }
}

type CustomDatasetFormQualityCheckValueAndItems = {
    field_name: string
    operation: string
    compare_value: string
    items: OptionItem[]
}

type TourismState = {
    loading: boolean
    current_dashboard_name: string
    current_dataprovider: string
    current_filtered_dataset: string
    current_timeseries_datatype: string
    timeseries_datatypes: Readonly<OptionItem>[]
    current_timeseries_mperiod: string
    timeseries_mperiods: readonly OptionItem[]
    current_timeseries_active_status: string
    timeseries_active_statuses: readonly OptionItem[]
    qualityChecks: CustomDatasetFormQualityCheckValueAndItems[]
    openapi: DatasetsOpenapi | null
    datasets: DatasetItem[]
}

type ElaborationHandle = {
    setText: (text: string) => void
    closeAfter: (ms: number) => void
    requireOk: (text?: string) => Promise<void>
    close: () => void
}

function createTourismState(): TourismState {
    return {
        loading: false,
        current_dashboard_name: '',
        current_dataprovider: ALL_DATA_PROVIDERS,
        current_filtered_dataset: '',
        current_timeseries_datatype: '',
        timeseries_datatypes: [],
        current_timeseries_mperiod: '',
        timeseries_mperiods: [
            { value: '', label: '' },
            { value: '60', label: '60' },
            { value: '3600', label: '3600' }
        ],
        current_timeseries_active_status: 'only-active',
        timeseries_active_statuses: [
            { value: 'all', label: 'all' },
            { value: 'only-active', label: 'only active' },
            { value: 'only-not-active', label: 'only not active' }
        ],
        qualityChecks: [],
        openapi: null,
        datasets: []
    }
}

function filtered_datasets(state: TourismState): readonly OptionItem[] {
    const provider = state.current_dataprovider
    return state.datasets
        .filter((d) => (d.DataProvider ?? []).includes(provider) || provider === ALL_DATA_PROVIDERS)
        .map((d): OptionItem => ({ value: d.Shortname, label: d.Shortname }))
}

function data_providers(state: TourismState): readonly OptionItem[] {
    const providers = new Set<string>()
    state.datasets.forEach((d) => (d.DataProvider || []).forEach((dd) => { if (dd !== '') providers.add(dd) }))
    const result = Array.from(providers)
    result.sort()
    result.unshift(ALL_DATA_PROVIDERS)
    return result.map((d): OptionItem => ({ value: d, label: d }))
}

function datasets_filtered_current_type(state: TourismState): string {
    const current = state.current_filtered_dataset
    if (state.datasets.length === 0 || current === '')
        return ''
    const found = state.datasets.find((d) => d.Shortname === current)
    return found ? found.ApiType : ''
}

function current_filtered_dataset_object(state: TourismState): DatasetItem | null {
    const curr = state.current_filtered_dataset
    const list = state.datasets.filter((d) => d.Shortname === curr)
    return list.length === 0 ? null : list[0]
}

function field_names(state: TourismState): OptionItem[] {
    const api = state.openapi
    if (api === null)
        return []
    const currDataset = current_filtered_dataset_object(state)
    if (currDataset === null)
        return []
    const datasetName = currDataset.ApiUrl.split('/').pop()
    const byId = Object.keys(api.paths).filter((p) => p.endsWith('/' + datasetName + '/{id}'))
    if (!api.paths[byId[0]])
        return [{ value: JSON.stringify({
            name: 'mvalue',
            type: 'number',
            is_array: false
        } as SelectedFieldType), label: 'mvalue' }]
    let ref = api.paths[byId[0]].get.responses[200].content['application/json'].schema.$ref
    ref = ref.substring(1)
    const refParts = ref.split('/')
    const schemaName = refParts.pop()!
    const primitiveProperties = traverseProperties('', api.components.schemas, schemaName)
    primitiveProperties.sort((a, b) => a.label.localeCompare(b.label))
    return primitiveProperties
}

function field_names_found(fieldNames: OptionItem[]): boolean {
    return fieldNames.length !== 1 || fieldNames[0].value !== ''
}

function is_qualitychecks_valid(qualityChecks: ReadonlyArray<CustomDatasetFormQualityCheck>): boolean {
    for (let i = 0; i < qualityChecks.length; i++) {
        if (!qualityChecks[i].isvalid)
            return false
    }
    return true
}

function traverseProperties(prefix: string, schemas: Schemas, schemaName: string, options: OptionItem[] = []): OptionItem[] {
    const properties = schemas[schemaName].properties
    for (const [k, p] of Object.entries(properties)) {
        const fullk = prefix + k
        if (['string', 'boolean', 'number', 'integer'].includes(p.type))
            options.push({
                value: JSON.stringify({ name: fullk, type: p.type, is_array: false } as SelectedFieldType),
                label: `${fullk} {${p.type}}`
            })
        else if (p.type === 'object') {
            if (p.$ref) {
                const name = p.$ref.split('/').pop()!
                traverseProperties(k + '.', schemas, name, options)
            }

            if (p.additionalProperties.$ref) {
                const name = p.additionalProperties.$ref.split('/').pop()!
                traverseProperties(k + '.*.', schemas, name, options)
            }
        }
        else if (p.type === 'array') {
            if (['string', 'boolean', 'number', 'integer'].includes(p.items.type)) {
                options.push({
                    value: JSON.stringify({ name: fullk, type: p.items.type, is_array: true } as SelectedFieldType),
                    label: `${fullk}[] {${p.items.type}}`
                })
                continue
            }
            const name = p.items.$ref.split('/').pop()!
            traverseProperties(k + '[n].', schemas, name, options)
        }
    }
    return options
}

export class CustomDatasetForm extends CommonWebComponent
{
    #state: TourismState
    #startPromise: Promise<void>
    #currentCustomDashboardId: number | null = null
    #loadingElement: HTMLElement
    #loadingMessageElement: HTMLElement
    #loadingOkButton: HTMLButtonElement
    #loadingCloseTimeoutId: number | null = null
    #loadingOkResolver: (() => void) | null = null
    #defaultElaborationMessage: string
    #timeseriesFetchAbortController: AbortController | null = null
    #lastTimeseriesDatasetName: string | null = null

    #formIsvalidSpan: HTMLElement

    #dataproviders: AutoComplete
    #datasets: AutoComplete
    #datasetType: HTMLElement
    #dashboardName: HTMLInputElement
    #timeseriesNotApplicableRow: HTMLElement
    #timeseriesActiveRow: HTMLElement
    #timeseriesActiveStatus: AutoComplete
    #timeseriesDatatypeRow: HTMLElement
    #timeseriesDatatype: AutoComplete
    #timeseriesPeriodRow: HTMLElement
    #timeseriesPeriod: AutoComplete
    #addCheckButton: HTMLButtonElement
    #saveButton: HTMLButtonElement
    #noFieldNames: HTMLElement
    #checksdiv: HTMLElement
    #qualityCheckElements: CustomDatasetFormQualityCheck[] = []

    constructor()
    {
        super(template)

        this.#loadingElement = this.querySelector('.pleasewait')
        this.#loadingMessageElement = this.#loadingElement.querySelector('.pleasewait-message')!
        this.#loadingOkButton = this.#loadingElement.querySelector('.pleasewait-ok')!
        this.#defaultElaborationMessage = (this.#loadingMessageElement.textContent || 'elaboration in progress').trim()
        this.#loadingOkButton.onclick = () => {
            const resolver = this.#loadingOkResolver
            this.#loadingOkResolver = null
            if (resolver) {
                resolver()
            }
            this.#hideElaboration()
        }

        this.#dataproviders = this.querySelector('.dataproviders') as AutoComplete
        this.#datasets = this.querySelector('.datasets') as AutoComplete
        this.#datasetType = this.querySelector('.dataset-type')
        this.#dashboardName = this.querySelector('.dashboard-name') as HTMLInputElement
        this.#timeseriesNotApplicableRow = this.querySelector('.timeseries-na-row')
        this.#timeseriesActiveRow = this.querySelector('.timeseries-active-row')
        this.#timeseriesActiveStatus = this.querySelector('.timeseries-active-status') as AutoComplete
        this.#timeseriesDatatypeRow = this.querySelector('.timeseries_div')
        this.#timeseriesDatatype = this.querySelector('.timeseries-datatype') as AutoComplete
        this.#timeseriesPeriodRow = this.querySelector('.period_div')
        this.#timeseriesPeriod = this.querySelector('.timeseries-mperiod') as AutoComplete
        this.#addCheckButton = this.querySelector('.add-check') as HTMLButtonElement
        this.#saveButton = this.querySelector('.save-dashboard') as HTMLButtonElement
        this.#noFieldNames = this.querySelector('.no-field-names')
        this.#checksdiv = this.querySelector('.checks')

        this.#formIsvalidSpan = this.querySelector('.form-is-valid')

        this.#state = createTourismState()
        this.#setupUiEffects()

        this.#startPromise = this.#onstart()
    }

    async loadCustomDashboard(definition: any, dashboardId: number, dashboardName?: string)
    {
        await this.#startPromise
        this.#currentCustomDashboardId = dashboardId
        const state = this.#state
        state.current_dashboard_name = dashboardName ?? ''
        state.current_dataprovider = definition.data_provider ?? ''
        state.current_filtered_dataset = definition.dataset ?? ''
        state.current_timeseries_active_status = definition.timeseries?.active_status ?? 'only-active'
        state.current_timeseries_datatype = definition.timeseries?.datatype ?? ''
        state.current_timeseries_mperiod = definition.timeseries?.mperiod ?? ''
        const checks = Array.isArray(definition.checks) ? definition.checks : []
        const fieldNames = field_names(state)
        state.qualityChecks = checks.map((row: any) => ({
            __id: crypto.randomUUID(),
            field_name: row.field_name ?? '',
            operation: row.operation ?? '',
            compare_value: row.compare_value ?? '',
            isvalid: !!row.isvalid,
            items: fieldNames
        }))
        this.#resync_derived_resources()
    }

    setElaborationInProgress(message: string = 'operation in progress ...'): ElaborationHandle
    {
        this.#showElaboration()
        this.#setElaborationText(message)

        const handle: ElaborationHandle = {
            setText: (text: string) => {
                this.#setElaborationText(text)
            },
            closeAfter: (ms: number) => {
                if (!Number.isFinite(ms) || ms <= 0) {
                    return
                }
                this.#setRequiresOk(false)
                this.#clearElaborationTimeout()
                this.#loadingCloseTimeoutId = window.setTimeout(() => {
                    this.#hideElaboration()
                }, ms)
            },
            requireOk: (text?: string) => {
                if (typeof text === 'string') {
                    this.#setElaborationText(text)
                }
                this.#clearElaborationTimeout()
                this.#setRequiresOk(true)
                return new Promise<void>((resolve) => {
                    this.#loadingOkResolver = resolve
                })
            },
            close: () => {
                this.#hideElaboration()
            }
        }

        return handle
    }

    #setElaborationText(text: string)
    {
        this.#loadingMessageElement.textContent = text || this.#defaultElaborationMessage
    }

    #showElaboration()
    {
        this.#loadingElement.classList.add('elaborationinprogress')
    }

    #hideElaboration()
    {
        this.#clearElaborationTimeout()
        this.#setRequiresOk(false)
        this.#loadingElement.classList.remove('elaborationinprogress')
    }

    #setRequiresOk(isRequired: boolean)
    {
        this.#loadingElement.classList.toggle('requires-ok', isRequired)
        if (!isRequired) {
            this.#loadingOkResolver = null
        }
    }

    #clearElaborationTimeout()
    {
        if (this.#loadingCloseTimeoutId !== null) {
            clearTimeout(this.#loadingCloseTimeoutId)
            this.#loadingCloseTimeoutId = null
        }
    }

    getCustomDashboardDraft()
    {
        const state = this.#state
        return {
            id: this.#currentCustomDashboardId,
            name: state.current_dashboard_name || state.current_filtered_dataset || 'custom_dashboard',
            test_definition_json: {
                data_provider: state.current_dataprovider,
                dataset: state.current_filtered_dataset,
                dataset_type: datasets_filtered_current_type(state),
                timeseries: {
                    active_status: state.current_timeseries_active_status,
                    datatype: state.current_timeseries_datatype,
                    mperiod: state.current_timeseries_mperiod
                },
                checks: state.qualityChecks.map((row) => ({
                    field_name: row.field_name,
                    operation: row.operation,
                    compare_value: row.compare_value,
                }))
            }
        }
    }

    #setupUiEffects()
    {
        this.#dashboardName.oninput = () => {
            this.#state.current_dashboard_name = this.#dashboardName.value
            this.#resync_derived_resources()
        }
        this.#dataproviders.onchange = () => {
            this.#onchange_current_dataprovider(this.#dataproviders.isvalid, this.#dataproviders.value)
        }
        this.#datasets.onchange = () => {
            this.#onchange_current_filtered_dataset(this.#datasets.isvalid, this.#datasets.value)
        }
        this.#timeseriesActiveStatus.onchange = () => {
            this.#onchange_current_timeseries_active_status(
                this.#timeseriesActiveStatus.isvalid,
                this.#timeseriesActiveStatus.value
            )
        }
        this.#timeseriesDatatype.onchange = () => {
            this.#state.current_timeseries_datatype = this.#timeseriesDatatype.value
            this.#resync_derived_resources()
        }
        this.#timeseriesPeriod.onchange = () => {
            this.#state.current_timeseries_mperiod = this.#timeseriesPeriod.value
            this.#resync_derived_resources()
        }
        this.#addCheckButton.onclick = () => this.#onclick_add_check()

        this.#saveButton.onclick = () => {
            this.dispatchEvent(new CustomEvent('save-custom-dashboard', { bubbles: true, composed: true }))
        }

        this.querySelector('.testing').onclick = async () => {
            const showOptionsButton = this.#dataproviders.testing_htmlelements().button_showoptions
            showOptionsButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
            await new Promise(s => setTimeout(s, 1000))
            const txt_input = this.#dataproviders.testing_htmlelements().input_filter
            for (const txt of ['2', '22', '222']) {
                txt_input.value = txt
                txt_input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
                await new Promise(s => setTimeout(s, 2000))
            }
        }
    }

    #resync_derived_resources(): void {
        const state = this.#state
        this.classList.toggle('loading', state.loading)

        if (this.#dashboardName.value !== state.current_dashboard_name) {
            this.#dashboardName.value = state.current_dashboard_name
        }

        const dataProviders = data_providers(state)
        this.#dataproviders.batchUpdate().items([...dataProviders]).value(state.current_dataprovider).commit()

        const filteredDatasets = filtered_datasets(state)
        this.#datasets.batchUpdate().items([...filteredDatasets]).value(state.current_filtered_dataset).commit()

        const datasetType = datasets_filtered_current_type(state)
        this.#datasetType.textContent = datasetType

        const isTimeseries = datasetType === 'timeseries'
        const notApplicableValue = 'N/A'
        if (!isTimeseries) {
            if (state.current_timeseries_active_status !== notApplicableValue) {
                state.current_timeseries_active_status = notApplicableValue
            }
            if (state.current_timeseries_datatype !== notApplicableValue) {
                state.current_timeseries_datatype = notApplicableValue
            }
            if (state.current_timeseries_mperiod !== notApplicableValue) {
                state.current_timeseries_mperiod = notApplicableValue
            }
        } else {
            if (state.current_timeseries_active_status === notApplicableValue) {
                state.current_timeseries_active_status = 'only-active'
            }
            if (state.current_timeseries_datatype === notApplicableValue) {
                state.current_timeseries_datatype = ''
            }
            if (state.current_timeseries_mperiod === notApplicableValue) {
                state.current_timeseries_mperiod = ''
            }
        }
        this.#timeseriesNotApplicableRow.setAttribute('data-isvisible', String(!isTimeseries))
        this.#timeseriesActiveRow.setAttribute('data-isvisible', String(isTimeseries))
        this.#timeseriesDatatypeRow.setAttribute('data-isvisible', String(isTimeseries))
        this.#timeseriesPeriodRow.setAttribute('data-isvisible', String(isTimeseries))

        this.#timeseriesActiveStatus.batchUpdate()
            .items([...state.timeseries_active_statuses])
            .value(state.current_timeseries_active_status)
            .commit()

        this.#timeseriesDatatype.batchUpdate()
            .items([...state.timeseries_datatypes])
            .value(state.current_timeseries_datatype)
            .commit()

        this.#timeseriesPeriod.batchUpdate()
            .items([...state.timeseries_mperiods])
            .value(state.current_timeseries_mperiod)
            .commit()

        const fieldNames = field_names(state)
        const hasFieldNames = field_names_found(fieldNames)
        this.#addCheckButton.disabled = !hasFieldNames
        this.#noFieldNames.classList.toggle('display-none', hasFieldNames)

        const nextQualityCheckElements: CustomDatasetFormQualityCheck[] = []
        for (let i = 0; i < state.qualityChecks.length; i++) {
            const row = state.qualityChecks[i]
            let qualityCheck = this.#qualityCheckElements[i]
            if (!qualityCheck) {
                qualityCheck = new CustomDatasetFormQualityCheck()
            }
            qualityCheck.setAttribute('data-testid', 'checks-' + i)
            qualityCheck.value_field_name = row.field_name
            qualityCheck.value_operation = row.operation
            qualityCheck.value_compare_value = row.compare_value
            qualityCheck.items = fieldNames
            qualityCheck.onchange = () => {
                const prevRow = this.#state.qualityChecks[i]

                this.#state.qualityChecks[i] = {
                    field_name: qualityCheck.value_field_name,
                    operation: qualityCheck.value_operation,
                    compare_value: qualityCheck.value_compare_value,
                    items: prevRow.items
                }

                void prevRow
                this.#resync_derived_resources()
            }
            qualityCheck.delete_button.onclick = () => {
                if (confirm('Are you sure?')) {
                    this.#state.qualityChecks.splice(i, 1)
                    this.#qualityCheckElements.splice(i, 1)
                    this.#resync_derived_resources()
                }
            }
            nextQualityCheckElements.push(qualityCheck)
        }
        this.#qualityCheckElements = nextQualityCheckElements
        const currentChildren = Array.from(this.#checksdiv.children)
        const sameOrder = currentChildren.length === nextQualityCheckElements.length &&
            currentChildren.every((child, i) => child === nextQualityCheckElements[i])
        if (!sameOrder) {
            for (let i = 0; i < nextQualityCheckElements.length; i++) {
                const row = nextQualityCheckElements[i]
                const currentChild = this.#checksdiv.children[i]
                if (currentChild !== row) {
                    this.#checksdiv.insertBefore(row, currentChild ?? null)
                }
            }
            for (const child of Array.from(this.#checksdiv.children)) {
                if (!nextQualityCheckElements.includes(child as CustomDatasetFormQualityCheck)) {
                    child.remove()
                }
            }
        }
        const rows_valid = is_qualitychecks_valid(nextQualityCheckElements)
        const currentDataset = current_filtered_dataset_object(state)
        if (currentDataset && currentDataset.ApiType === 'timeseries') {
            const datasetName = currentDataset.ApiUrl.split('/').pop() || ''
            if (datasetName !== this.#lastTimeseriesDatasetName) {
                this.#lastTimeseriesDatasetName = datasetName
                void this.#fetch_timeseries_datatypes(datasetName)
            }
        } else {
            this.#lastTimeseriesDatasetName = null
        }

        const form_errors: string[] = []
        if (!this.#dataproviders.isvalid) {
            form_errors.push('select a data provider')
        }
        if (!this.#datasets.isvalid) {
            form_errors.push('select a dataset')
        }
        if (isTimeseries && !this.#timeseriesDatatype.isvalid) {
            form_errors.push('select a timeseries datatype')
        }
        if (isTimeseries && !this.#timeseriesActiveStatus.isvalid) {
            form_errors.push('select a timeseries status')
        }
        if (isTimeseries && !this.#timeseriesPeriod.isvalid) {
            form_errors.push('select a timeseries period')
        }
        if (this.#state.qualityChecks.length === 0) {
            form_errors.push('add at least one check')
        }
        if (!rows_valid) {
            form_errors.push('invalid checks')
        }
        const form_is_valid = form_errors.join(', ')

        this.#formIsvalidSpan.textContent = form_is_valid

        // this.#saveButton.disabled = form_is_valid !== ''
    }

    async #fetch_timeseries_datatypes(datasetName: string) {
        this.#timeseriesFetchAbortController?.abort()
        const controller = new AbortController()
        this.#timeseriesFetchAbortController = controller
        try {
            const resp = await fetch(
                `${MOBILITY_API_BASE}/v2/flat/*/*?select=stype,tname&where=stype.eq.${datasetName}`,
                { signal: controller.signal }
            )
            const json = await resp.json()
            const list: OptionItem[] = json.data.map((r: any): OptionItem => ({ label: r.tname, value: r.tname }))
            list.sort((a, b) => a.label.localeCompare(b.label))
            this.#state.timeseries_datatypes = list
            this.#resync_derived_resources()
        } catch (err) {
            if (!(err instanceof DOMException && err.name === 'AbortError')) {
                throw err
            }
        }
    }

    async #onstart() {
        const startState = this.#state
        startState.loading = true
        this.#resync_derived_resources()
        await new Promise((s) => setTimeout(s, 0))
        const datasetlist_response = await fetch(
            `${TOURISM_API_BASE}/v1/MetaData?pagesize=300&origin=webcomp-datasets-list`
        )
        const datasetlist: DatasetItem[] = (await datasetlist_response.json()).Items
        datasetlist.sort((aName, bName) => {
            return aName > bName ? 1 : (aName < bName ? -1 : 0)
        })

        const metadata_response = await fetch(`${TOURISM_API_BASE}/swagger/v1/swagger.json`)
        const metadata = await metadata_response.json() as DatasetsOpenapi

        const state = this.#state
        state.datasets = datasetlist
        state.openapi = metadata
        state.loading = false
        this.#resync_derived_resources()
    }

    #onchange_current_dataprovider(isvalid: boolean, value: string) {
        if (isvalid)
            this.#state.current_dataprovider = value
        this.#state.current_filtered_dataset = ''
        this.#state.qualityChecks = []
        this.#resync_derived_resources()
    }

    #onchange_current_filtered_dataset(isvalid: boolean, value: string) {
        const dataset = isvalid ? value : ''
        this.#state.current_filtered_dataset = dataset
        if (!this.#state.current_dashboard_name) {
            this.#state.current_dashboard_name = dataset
        }
        this.#state.current_timeseries_datatype = ''
        this.#state.current_timeseries_mperiod = ''
        this.#resync_derived_resources()
    }

    #onchange_current_timeseries_active_status(isvalid: boolean, value: string) {
        this.#state.current_timeseries_active_status = isvalid ? value : 'only-active'
        this.#resync_derived_resources()
    }

    #onclick_add_check() {
        const state = this.#state
        state.qualityChecks.push({
            field_name: '',
            compare_value: '',
            operation: '',
            items: field_names(state)
        })
        this.#resync_derived_resources()
    }
}

const CustomDatasetFormTagName = `cs-${CustomDatasetForm.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`
customElements.define(CustomDatasetFormTagName, CustomDatasetForm)
