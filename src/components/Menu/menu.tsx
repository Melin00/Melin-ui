import React, { FC, createContext, useState } from "react";
import classNames from 'classnames';
import { MenuItemProps } from './menuItem'

type MenuMode = 'horizontal' | 'vertical'
type SelectCallback = (selectIndex: string) => void
export interface MenuProps {
    defaultIndex?: string
    className?: string
    mode?: MenuMode
    style?: React.CSSProperties
    onSelect?: SelectCallback
    children?: React.ReactNode
    defaultOpenSubMenus?: string[]
}

interface IMenuContext {
    index: string
    onSelect?: SelectCallback
    mode?: MenuMode
    defaultOpenSubMenus?: string[]
}

export const MenuContext = createContext<IMenuContext>({ index: '0' })

export const Menu: FC<MenuProps> = (props) => {
    const { className, mode = 'horizontal', defaultIndex = '0', style, children, onSelect, defaultOpenSubMenus = [] }  = props
    const classes = classNames('melin-menu', className, {
        'menu-vertical': mode === 'vertical',
        'menu-horizontal': mode !== 'vertical'
    })
    const [currentActive, setCurrentActive] = useState(defaultIndex)
    const handleClick = (index: string) => {
        setCurrentActive(index)
        onSelect && onSelect(index)
    }
    const dataMenuContext: IMenuContext = {
        index: currentActive || '0',
        onSelect: handleClick,
        mode,
        defaultOpenSubMenus,
    }

    const renderChildren = () => {
        return React.Children.map(children, (child, index) => {
            const childElement = child as React.FunctionComponentElement<MenuItemProps>
            const { displayName = '' } = childElement.type
            if (['MenuItem', 'SubMenu'].includes(displayName)) {
                return React.cloneElement(childElement, { index: index.toString() })
            } else {
                console.error('child is not a MenuItem component')
            }
        })
    }
    return (
        <ul className={classes} style={style} data-testid="test-menu">
            <MenuContext.Provider value={dataMenuContext}>
                {renderChildren()}
            </MenuContext.Provider>
        </ul>
    )
}

export default Menu