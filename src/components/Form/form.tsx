import React, { createContext, forwardRef, ForwardRefRenderFunction, ReactNode, useImperativeHandle } from "react";
import { ValidateError } from 'async-validator'
import useStore, { FormState } from "./useStore";

export type RenderProps = (form: FormState) => ReactNode

export interface FormProps {
    name?: string
    children?: ReactNode | RenderProps
    initialValue?: Record<string, any>
    /**提交表单且数据验证成功后回调事件 */
    onFinish?: (values: Record<string, any>) => void;
    /**提交表单且数据验证失败后回调事件 */
    onFinishFailed?: (values: Record<string, any>, errors: Record<string, ValidateError[]>) => void;
}

export type IFormContext = 
Pick<ReturnType<typeof useStore>, 'dispatch' | 'fields' | 'validateFields'> &
Pick<FormProps, 'initialValue'>
export type IFormRef = Omit<ReturnType<typeof useStore>, 'fields' | 'dispatch' | 'form'>
export const FormContext = createContext<IFormContext>({} as IFormContext)

export const Form = forwardRef<IFormRef, FormProps>((props, ref) => {
    const { name = 'form', children, initialValue, onFinish, onFinishFailed } = props
    const { form, fields, dispatch, ...restProps } = useStore(initialValue)
    const { validateFields, validateAllFields } = restProps
    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const { isValid, errors, values } = await validateAllFields()
        if (isValid && onFinish) {
          onFinish(values)
        } else if(!isValid && onFinishFailed) {
          onFinishFailed(values, errors)
        }
    }
    let childrenNode: ReactNode
    if (typeof children === 'function') {
        childrenNode = children(form)
    } else {
        childrenNode = children
    }
    useImperativeHandle(ref, () => {
        return {
            ...restProps
        }
    })
    return (
        <form name={name} className="form" onSubmit={submitForm}>
            <FormContext.Provider value={{ dispatch, fields, initialValue, validateFields }}>
                {childrenNode}
            </FormContext.Provider>
        </form>
    )
})

export default Form