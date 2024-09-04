import React from "react";
import { Meta, StoryObj } from '@storybook/react';
import Button from "./button";

const meta: Meta<typeof Button> = {
    title: 'Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        btnType: 'default',
        children: '默认样式按钮',
    },
}

export const Primary: Story = {
    args: {
        btnType: 'primary',
        children: 'primary按钮',
    },
}

export const Danger: Story = {
    args: {
        btnType: 'danger',
        children: 'danger按钮',
    },
}

export const Link: Story = {
    args: {
        btnType: 'link',
        href: 'http://www.baidu.com',
        children: 'link按钮',
    },
}

export const Large: Story = {
    args: {
        size: 'lg',
        children: 'large按钮',
    },
}

export const Small: Story = {
    args: {
        size: 'sm',
        children: 'small按钮',
    },
}