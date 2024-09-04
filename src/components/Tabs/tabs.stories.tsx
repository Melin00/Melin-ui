import React from 'react'
import { StoryFn, Meta } from '@storybook/react'

import Tabs from './tabs'
import TabItem from './tabItem'
import Icon from '../Icon'
export default {
  title: 'Tabs',
  id: 'Tabs',
  component: Tabs,
  subcomponents: { 'TabItem': TabItem },
  tags: ['autodocs'],
} as Meta<typeof Tabs>

export const ADefaultTabs: StoryFn = (args) => (
  <Tabs {...args}>
    <TabItem label="选项卡一">this is content one</TabItem>
    <TabItem label="选项卡二">this is content two</TabItem>
    <TabItem label="用户管理">this is content three</TabItem>
  </Tabs>
)
ADefaultTabs.storyName = '默认的Tabs'
export const BCardTabs: StoryFn= (args) => (
  <Tabs {...args} type="card">
    <TabItem label='card1'>this is card one</TabItem>
    <TabItem label="card2">this is content two</TabItem>
    <TabItem label="disabled" disabled>this is content three</TabItem>
  </Tabs> 
)
BCardTabs.storyName = '选项卡样式的Tabs'
export const CCustomTabs: StoryFn = (args) => (
  <Tabs {...args} type="card">
    <TabItem label={<><Icon icon="check-circle" />  自定义图标</>}>this is card one</TabItem>
    <TabItem label="tab2">this is content two</TabItem>
  </Tabs> 
)
CCustomTabs.storyName = '自定义选项卡样式'