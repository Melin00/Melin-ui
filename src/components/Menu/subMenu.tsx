import React, { FC, useContext, useRef, useState } from "react";
import classNames from 'classnames';
import { MenuContext } from "./menu";
import { MenuItemProps } from "./menuItem";
import Icon from "../Icon/icon";
import Transition from '../Transition/transition'
export interface SubMenuProps {
    index?: string
    title: string
    className?: string
    children?: React.ReactNode
}

export const SubMenu: FC<SubMenuProps> = (props) => {
    const context = useContext(MenuContext)
    const { index, title, className, children } = props
    const openedSubMenu = context.defaultOpenSubMenus as string[]
    const isOpened = (index && context.mode === 'vertical') ? openedSubMenu.includes(index) : false
    const [open, setOpen] = useState(isOpened)
    const nodeRef = useRef(null)
    const classes = classNames('menu-item submenu-item', className, { 
        'is-active': context.index === index,
        'is-opened': open,
        'is-vertical': context.mode === 'vertical'
    })
    const renderChildren = () => {
        const childrenComponents =  React.Children.map(children, (child, i) => {
            const childElement = child as React.FunctionComponentElement<MenuItemProps>
            const { displayName } = childElement.type
            if (displayName === 'MenuItem') {
                return React.cloneElement(childElement, { index: `${index}-${i}` })
            } else {
                console.error('child is not a MenuItem component')
            }
        })
        return (
            <Transition 
            in={open} 
            timeout={300} 
            animation='zoom-in-top' 
            nodeRef={nodeRef}
            >
                <ul ref={nodeRef} className='submenu'>
                    {childrenComponents}
                </ul>
            </Transition>
        )
    }
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setOpen(!open)
    }
    let timer: any = null
    const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
        clearTimeout(timer)
        e.preventDefault()
        timer = setTimeout(() => {
            setOpen(toggle)
        }, 300);
    }
    const clickEvent = context.mode === 'vertical' ? { onClick: handleClick } : {}
    const hoverEvent = context.mode !== 'vertical' ? {
        onMouseEnter: (e: React.MouseEvent) => { handleMouse(e, true) },
        onMouseLeave: (e: React.MouseEvent) => { handleMouse(e, false) }
    } : {}
    return (
        <li key={index} className={classes} {...hoverEvent}>
            <div className="submenu-title" {...clickEvent}>
                {title}
            <Icon icon="angle-down" className="arrow-icon" />
            </div>
            {renderChildren()}
        </li>
    )
}
SubMenu.displayName = 'SubMenu'
export default SubMenu