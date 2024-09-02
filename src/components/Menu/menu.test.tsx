import React from 'react';
import { render, screen, fireEvent, cleanup, RenderResult, waitFor } from '@testing-library/react'
import Menu, { MenuProps } from './menu';
import MenuItem from './menuItem';
import SubMenu from './subMenu';

jest.mock('../Icon/icon', () => {
    return () => {
      return <i className="fa" />
    }
  })
jest.mock('react-transition-group', () => {
return {
    CSSTransition: (props: any) => {
    return props.children
    }
}
})

const testProps: MenuProps = {
    defaultIndex: '0',
    onSelect: jest.fn(),
    className: 'test',
}

const testVerProps: MenuProps = {
    defaultIndex: '0',
    mode: 'vertical'
}

const generateMenu = (props: MenuProps) => {
    return (
        <Menu {...props}>
            <MenuItem>active</MenuItem>
            <MenuItem disabled>disabled</MenuItem>
            <MenuItem>xyz</MenuItem>
            <SubMenu title='dropdown'>
                <MenuItem>cool</MenuItem>
            </SubMenu>
        </Menu>
    )
}

const createFileStyle = () => {
    const cssFile: string = `
        .submenu {
            display: none;
        }
        .submenu.menu-opened {
            display: block;
        }
    `
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = cssFile
    return style
}



let wrapper: RenderResult, menuElement: HTMLElement, activeElement: HTMLElement, disabledElement: HTMLElement

describe('test Menu and MenuItem component', () => {
    beforeEach(() => {
        // eslint-disable-next-line testing-library/no-render-in-setup
        wrapper = render(generateMenu(testProps))
        wrapper.container.append(createFileStyle())

        menuElement = screen.getByTestId('test-menu')
        activeElement = screen.getByText('active')
        disabledElement = screen.getByText('disabled')
    })
    test('should render correct Menu and MenuItem based on default props', () => {
        expect(menuElement).toBeInTheDocument()
        expect(menuElement).toHaveClass('melin-menu test')
        // eslint-disable-next-line testing-library/no-node-access
        expect(menuElement.querySelectorAll(':scope > li').length).toEqual(4)
        expect(activeElement).toHaveClass('is-active')
        expect(disabledElement).toHaveClass('is-disabled')
    })

    test('click items should change active and call the right callback', () => {
        const thirdElement = screen.getByText('xyz')
        fireEvent.click(thirdElement)
        expect(thirdElement).toHaveClass('is-active')
        expect(activeElement).not.toHaveClass('is-active')
        expect(testProps.onSelect).toHaveBeenCalledWith('2')
        fireEvent.click(disabledElement)
        expect(disabledElement).not.toHaveClass('is-active')
        expect(testProps.onSelect).not.toHaveBeenCalledWith('1')
    })

    test('should render vertical mode when mode is set vertical', () => {
        cleanup()
        render(generateMenu(testVerProps))
        const menuElement = screen.getByTestId('test-menu')
        expect(menuElement).toHaveClass('menu-vertical')
    })

    test('should show dropdown items when hover on subMenu', async () => {
        const coolElement = wrapper.getByText('cool')
        expect(coolElement).not.toBeVisible()
        const dropdownEle = screen.getByText('dropdown')
        fireEvent.mouseEnter(dropdownEle)
        await waitFor(() => {
            expect(coolElement).toBeVisible()
        })
        fireEvent.click(screen.getByText('cool'))
        expect(testProps.onSelect).toHaveBeenCalledWith('3-0')
        fireEvent.mouseLeave(dropdownEle)
        await waitFor(() => {
            expect(coolElement).not.toBeVisible()
        })
    })
}) 