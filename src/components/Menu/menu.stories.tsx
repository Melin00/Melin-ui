import React from "react";
import { Meta, StoryFn } from '@storybook/react';
import Menu from "./menu";
import MenuItem  from "./menuItem";
import SubMenu from "./subMenu";

const meta: Meta<typeof Menu> = {
    title: 'Menu',
    component: Menu,
    tags: ['autodocs'],
    subcomponents: { 
        SubMenu, 
        MenuItem
    }
} as Meta<typeof Menu>

export default meta

const Template: StoryFn = (args) => {
    return (
        <Menu {...args}>
            <MenuItem>cool link1</MenuItem>
            <MenuItem disabled>disabled</MenuItem>
            <SubMenu title='dropdown'>
                <MenuItem>cool link3</MenuItem>
                <MenuItem>cool link3</MenuItem>
                <MenuItem>cool link3</MenuItem>
            </SubMenu>
            <MenuItem>cool link3</MenuItem>
      </Menu>
    )
}

export const DefaultMenu = Template.bind({})
DefaultMenu.storyName = '默认Menu'

export const ClickMenu = Template.bind({})
ClickMenu.args = {
    defaultIndex: '3',
    mode: 'vertical'
}
ClickMenu.storyName = '纵向Menu'

export const COpenedMenu = Template.bind({})
COpenedMenu.args = { 
    mode: 'vertical',
    defaultOpenSubMenus: ['2']
}
COpenedMenu.storyName = '纵向默认展开'