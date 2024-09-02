import React from 'react';
import { render, screen, fireEvent, RenderResult, waitFor } from '@testing-library/react'
import axios from 'axios';
import Upload, { UploadProps } from './upload';

jest.mock('../Icon/icon', () => {
    return ({icon, onClick}: any) => {
        return (
            <span onClick={onClick}>{icon}</span>
        )
    }
})

jest.mock('axios')
const mockAxios = axios as jest.Mocked<typeof axios>
const testProps: UploadProps = {
    action: 'fakeurl.com',
    onSuccess: jest.fn(),
    onError: jest.fn(),
    onChange: jest.fn(),
    onRemove: jest.fn(),
    drag: true
}
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })
let wrapper: RenderResult, fileInput: HTMLElement, uploadArea: HTMLElement
describe('test upload component', () => {
    beforeEach(() => {
        // eslint-disable-next-line testing-library/no-render-in-setup
        wrapper = render(<Upload {...testProps}>Click to upload</Upload>)
        // eslint-disable-next-line testing-library/no-node-access
        fileInput = wrapper.container.querySelector('.file-input')!
        uploadArea = screen.getByText('Click to upload')
    })
    test('upload process should work fine', async () => {
        // mockAxios.post.mockImplementation(() => {
        //     return Promise.resolve({ data: 'cool' })
        // })
        mockAxios.post.mockResolvedValue({ data: 'cool' })
        expect(uploadArea).toBeInTheDocument()
        expect(fileInput).not.toBeVisible()
        fireEvent.change(fileInput, { target: { files: [testFile] }})
        expect(screen.getByText('spinner')).toBeInTheDocument()
        await waitFor(() => {
            expect(screen.getByText('test.png')).toBeInTheDocument()
        })
        expect(screen.getByText('check-circle')).toBeInTheDocument()
        expect(testProps.onSuccess).toHaveBeenCalledWith('cool', testFile)
        expect(testProps.onChange).toHaveBeenCalledWith(testFile)

        expect(screen.getByText('times')).toBeInTheDocument()
        fireEvent.click(screen.getByText('times'))
        expect(screen.queryByText('test.png')).not.toBeInTheDocument()
        expect(testProps.onRemove).toHaveBeenCalledWith(expect.objectContaining({
            raw: testFile,
            status: 'success',
            name: 'test.png'
        }))
    })

    test('drag and drop files should work file', async () => {
        fireEvent.dragOver(uploadArea)
        expect(uploadArea).toHaveClass('is-dragover')
        fireEvent.dragLeave(uploadArea)
        expect(uploadArea).not.toHaveClass('is-dragover')
        await fireEvent.drop(uploadArea, { dataTransfer: { files: [testFile] } })
        await waitFor(() => {
            expect(screen.getByText('test.png')).toBeInTheDocument()
        })
        expect(screen.getByText('check-circle')).toBeInTheDocument()
        expect(testProps.onSuccess).toHaveBeenCalledWith('cool', testFile)
        expect(testProps.onChange).toHaveBeenCalledWith(testFile)
    })
})