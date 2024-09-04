import { useReducer, useState } from "react"
import Schema, { RuleItem, ValidateError } from "async-validator"
import { mapValues, each } from 'lodash-es'

export type CustomRuleFunc = ({ getFieldValue }: any) => RuleItem
export type CustomRule = RuleItem | CustomRuleFunc
export interface FieldDetail {
    name: string
    value: string
    rules: CustomRule[]
    isValid: boolean
    errors: ValidateError[]
}

export interface ValidateErrorType extends Error {
    errors: ValidateError[];
    fields: Record<string, ValidateError[]>;
}

export interface FieldState {
    [key: string]: FieldDetail
}

export interface FormState {
    isValid: boolean
    isSubmitting: boolean;
    errors: Record<string, ValidateError[]>
}

type ActionType = 'addField' | 'updateValue' | 'updateValidateResult'

export interface FieldsAction {
    type: ActionType
    name: string
    value: any
}

const fieldsReducer = (state: FieldState, action: FieldsAction):FieldState  => {
    switch(action.type) {
        case 'addField':
            return {
                ...state,
                [action.name]: { ...action.value }
            }
        case 'updateValue':
            return {
                ...state,
                [action.name]: { ...state[action.name], value: action.value }
            }
        case 'updateValidateResult':
            const { isValid, errors } = action.value
            return {
                ...state,
                [action.name]: { ...state[action.name], isValid, errors }
            }
        default:
            return state
    }
}

const useStore = (initialValues?: Record<string, any>) => {
    const [form, setForm] = useState<FormState>({ isValid: true, isSubmitting: false, errors: {} })
    const [fields, dispatch] = useReducer(fieldsReducer, {})
    const getFieldValue = (key: string) => {
        return fields[key] && fields[key].value
    }
    const getFieldsValue = () => {
        return mapValues(fields, item => item.value)
    }
    const setFieldValue = (name: string, value: any) => {
        if (fields[name]) {
            dispatch({ type: 'updateValue', name, value })
        }
    }
    const resetFields = () => {
        each(getFieldsValue(), (value, name) => {
            if (fields[name]) {
              dispatch({ type: 'updateValue', name, value: ''})
            }
          })
        if (initialValues) {
          each(initialValues, (value, name) => {
            if (fields[name]) {
              dispatch({ type: 'updateValue', name, value})
            }
          })
        }
      }
    const transformRules = (rules: CustomRule[]) => {
        return rules.map(rule => {
            if (typeof rule === 'function') {
                const calledRule = rule({ getFieldValue })
                return calledRule
            } else {
                return rule
            }
        })
    }
    const validateFields = async (name: string) => {
        let isValid = true
        let errors: ValidateError[] = []
        const { value, rules } = fields[name]
        const afterRules = transformRules(rules)
        const descriptor = {
            [name]: afterRules
        }
        const valueMap = {
            [name]: value
        }
        const validator = new Schema(descriptor)
        try {
            await validator.validate(valueMap)
        } catch(e) {
            const err = e as ValidateErrorType
            errors = err.errors
            isValid = false
        } finally {
            dispatch({ type: 'updateValidateResult', name, value: { isValid, errors }})
        }
    }
    const validateAllFields = async () => {
        let isValid = true
        let errors: Record<string, ValidateError[]> = {}
        const valueMap = mapValues(fields, item => item.value)
        // {'username': 'abc'}
        const descriptor = mapValues(fields, item => transformRules(item.rules))
        const validator = new Schema(descriptor)
        setForm({ ...form, isSubmitting: true })
        try {
            await validator.validate(valueMap)
        } catch(e) {
            const err = e as ValidateErrorType
            isValid = false
            errors = err.fields
            each(fields, (value, name) => {
                // errors 中有对应的 key
                if (errors[name]) {
                const itemErrors = errors[name]
                dispatch({ type: 'updateValidateResult', name, value: { isValid: false, errors: itemErrors }})
                } else if (value.rules.length > 0 && !errors[name]) {
                dispatch({ type: 'updateValidateResult', name, value: { isValid: true, errors: [] }})
                }
                //  有对应的 rules，并且没有 errors
            })
        } finally {
            setForm({ ...form, isSubmitting: false, isValid, errors })
            return {
              isValid,
              errors,
              values: valueMap
            }
        }
    }
    return {
        fields,
        dispatch,
        form,
        validateFields,
        getFieldValue,
        validateAllFields,
        getFieldsValue,
        setFieldValue,
        resetFields
    }
}

export default useStore