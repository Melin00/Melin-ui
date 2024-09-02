import React, { FC } from "react";
import classNames from 'classnames';

type ButtonSize = 'lg' | 'sm'

type ButtonType = 'primary' |  'default' | 'danger' |  'link'

interface BaseButtonProps {
    disabled?: boolean
    className?: string
    size?: ButtonSize
    btnType?: ButtonType
    href?: string
    children?: React.ReactNode
}

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLElement>
type AnchorButtonProps = React.AnchorHTMLAttributes<HTMLElement>
export type ButtonNativeProps = Partial<NativeButtonProps & AnchorButtonProps>
export type ButtonProps = ButtonNativeProps & BaseButtonProps
export const Button: FC<ButtonProps> = (props) => {
    const {
        btnType = 'default',
        size = '',
        className,
        disabled = false,
        href,
        children,
        ...restProps
    }  = props
    const classes = classNames('btn', className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        'disabled': (btnType === 'link') && disabled
    })
    if (btnType === 'link' && href) {
        return (
            <a className={classes} href={href} {...restProps}>{children}</a>
        )
    }
    return (
        <button className={classes} disabled={disabled} {...restProps}>{children}</button>
    )
}

export default Button