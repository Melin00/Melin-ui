import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'
import Button, { ButtonProps } from './button';

const defaultProps = {
    onClick: jest.fn()
}

const testProps:ButtonProps = {
    btnType: 'primary',
    size: 'lg',
    className: 'klass'
}

const disabledProps:ButtonProps = {
    disabled: true,
    onClick: jest.fn()
}

describe('test Button component', () => {
    test('should render the correct default button', () => {
        render(<Button {...defaultProps}>Nice</Button>)
        const element = screen.getByText('Nice') as HTMLButtonElement
        expect(element).toBeInTheDocument()
        expect(element.tagName).toEqual('BUTTON')
        expect(element).toHaveClass('btn btn-default')
        expect(element.disabled).toBeFalsy()
        fireEvent.click(element)
        expect(defaultProps.onClick).toHaveBeenCalled()
    })

    test('should render the correct component base on different props', () => {
        render(<Button {...testProps}>Nice</Button>)
        const element = screen.getByText('Nice')
        expect(element).toBeInTheDocument()
        expect(element).toHaveClass('btn btn-primary btn-lg klass')
    })

    test('should render a link when btnType equals link and href is provided', () => {
        render(<Button btnType='link' href='https://www.baidu.com'>Link</Button>)
        const element = screen.getByText('Link')
        expect(element).toBeInTheDocument()
        expect(element.tagName).toEqual('A')
        expect(element).toHaveClass('btn btn-link')
    })

    test('should render disabled button when disabled set to true', () => {
        render(<Button {...disabledProps}>Disabled</Button>)
        const element = screen.getByText('Disabled') as HTMLButtonElement
        expect(element).toBeInTheDocument()
        expect(element.disabled).toBeTruthy()
        fireEvent.click(element)
        expect(disabledProps.onClick).not.toHaveBeenCalled()
    })
})