import React, { FC, ReactNode, useContext, useEffect } from "react";
import classNames from 'classnames'
import { CustomRule } from './useStore'
import { FormContext } from "./form";
export type SomeRequired<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>
export interface FormItemProps {
    label?: string
    children?: ReactNode
    name: string
    rules?: CustomRule[]
    /**子节点的值的属性，如 checkbox 的是 'checked' */
    valuePropName?: string;
    /**设置收集字段值变更的时机 */
    trigger?: string;
    /**设置如何将 event 的值转换成字段值 */
    getValueFromEvent?: (event: any) => any;
     /**设置字段校验的时机 */
    validateTrigger?: string;
}

export const FormItem:FC<FormItemProps> = (props) => {
    const { 
        label, 
        children, 
        name, 
        valuePropName = 'value',
        trigger = 'onChange',
        getValueFromEvent = (e) => e.target.value,
        rules = [],
        validateTrigger = 'onBlur'
    } = props as SomeRequired<FormItemProps, 'getValueFromEvent' | 'valuePropName' | 'trigger' | 'validateTrigger'>
    const {dispatch, fields, initialValue, validateFields} = useContext(FormContext)
    const rowClass = classNames('row', {
        'row-no-label': !label,
    })
    useEffect(() => {
        const value = (initialValue && initialValue[name]) || ''
        dispatch({ type: 'addField', name, value: { label, name, value, rules: rules || [], isValid: true, errors: [] } })
    }, [])
    const onValueUpdate = (e: any) => {
        const value = getValueFromEvent(e)
        dispatch({ type: 'updateValue', name, value })
    }

    const onValueValidate = async () => {
        await validateFields(name)
    }
    const fieldState = fields[name]
    const value = fieldState && fieldState.value
    const errors = fieldState && fieldState.errors
    const isRequired = rules.some(rule => (typeof rule !== 'function') && rule.required)
    const hasError = errors && errors.length > 0
    const labelClass = classNames({
        'form-item-required': isRequired
      })
      const itemClass = classNames('form-item-control', {
        'form-item-has-error': hasError
      })
    const controlProps: Record<string, any> = {}
    controlProps[valuePropName] = value
    controlProps[trigger] = onValueUpdate
    if (rules) {
        controlProps[validateTrigger] = onValueValidate
    }
    const childrenList = React.Children.toArray(children)
    // 没有子组件
    if (childrenList.length === 0) {
        console.error('No child element found in Form.Item, please provide one form component')
    }
    // 子组件大于一个
    if (childrenList.length > 1) {
        console.warn('Only support one child element in Form.Item, others will be omitted')
    }
    if (!React.isValidElement(childrenList[0])) {
        console.error('Child component is not a valid React Element')
    }
    const child = childrenList[0] as React.ReactElement
    const returnChildNode = React.cloneElement(child, {...child.props, ...controlProps })
    return (
        <div className={rowClass}>
            { label && 
                <div className="form-item-label">
                    <label className={labelClass} title={label}>{label}</label>
                </div>
            }
            <div className="form-item">
                <div className={itemClass}>
                    {returnChildNode}
                </div>
                { hasError && 
                    <div className='form-item-explain'>
                        <span>{errors[0].message}</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default FormItem