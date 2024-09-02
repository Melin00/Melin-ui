import React, { ChangeEvent, FC, useRef, useState } from "react";
import axios from "axios";
import UploadList from "./uploadList";
import Dragger from "./dragger";

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface UploadFile {
    uid: string
    size: number
    name: string
    status?: UploadFileStatus
    percent?: number
    raw?: File
    response?: any
    error?: any
}

export interface UploadProps {
    action: string
    onProgress?: (progress: number, file: File) =>void
    onSuccess?: (data: any, file: UploadFile) => void
    onError?: (err: any, file: UploadFile) => void
    beforeUpload?: (file: File) => boolean | Promise<File>
    onChange?: (file: UploadFile) => void
    onRemove?: (file: UploadFile) => void
    children?: React.ReactNode
    defaultFileList?: UploadFile[]
    /**设置上传的请求头部 */
    headers?: {[key: string]: any };
    /**上传的文件字段名 */
    name?: string;
    /**上传时附带的额外参数 */
    data?: {[key: string]: any };
    /**支持发送 cookie 凭证信息 */
    withCredentials?: boolean;
    /**可选参数, 接受上传的文件类型 */
    accept?: string;
    /**是否支持多选文件 */
    multiple?: boolean;
    /**是否支持拖拽上传 */
    drag?: boolean;
}

export const Upload:FC<UploadProps> = (props) => {
    const { 
        action,
        children,
        onProgress, 
        onSuccess, 
        onError, 
        beforeUpload, 
        onChange,
        defaultFileList,
        onRemove,
        name = 'file',
        data,
        headers,
        withCredentials,
        accept,
        multiple,
        drag,
    } = props
    const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || [])
    const inputFileRef = useRef<HTMLInputElement>(null)

    const handleRemove = (file: UploadFile) => {
        setFileList(preList => {
            return preList.filter(item => item.uid !== file.uid)
        })
        onRemove && onRemove(file)
    }

    const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
        setFileList(preList => {
            return preList.map(file => {
                if (file.uid === updateFile.uid) {
                    return {
                        ...file,
                        ...updateObj
                    }
                }
                return file
            })
        })
    }
    const handleClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click()
        }
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) {
            return
        }
        uploadFiles(files)
        if (inputFileRef.current) {
            inputFileRef.current.value = ''
        }
    }
    const uploadFiles = (files: FileList) => {
        const postFiles = Array.from(files)
        postFiles.forEach(file => {
            if (beforeUpload) {
                const result = beforeUpload(file)
                if (result && result instanceof Promise) {
                    result.then(progressedFile => {
                        post(progressedFile)
                    })
                } else if (result) {
                    post(file)
                }
            } else {
                post(file)
            }
        })
    }
    const post = (file: File) => {
        const _file: UploadFile = {
            uid: Date.now() + 'upload file',
            status: 'ready',
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file
        }
        // setFileList([...fileList, _file])
        setFileList(preList => {
            return [...preList, _file]
        })
        const formData = new FormData()
        formData.append(name || 'file', file)
        if (data) {
            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })
        }
        return axios.post(action, formData, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data'
            },
            withCredentials,
            onUploadProgress: (e) => {
                const percentage = Math.round((e.loaded * 100) / e.total!) || 0
                if (percentage < 100) {
                    updateFileList(_file, {
                        percent: percentage,
                        status: 'uploading'
                    })
                    _file.status = 'uploading'
                    _file.percent = percentage
                    onProgress && onProgress(percentage, file)
                }
            }
        })
        .then(resp => {
            console.log(resp)
            updateFileList(_file, {
                percent: 100,
                status: 'success',
                response: resp.data
            })
            _file.status = 'success'
            _file.percent = 100
            _file.response = resp.data
            if (onSuccess) {
                onSuccess(resp.data, _file)
            }
        })
        .catch(e => {
            console.log(e)
            updateFileList(_file, {
                percent: 0,
                status: 'error',
                error: e
            })
            _file.status = 'error'
            _file.percent = 0
            _file.error = e
            if (onError) {
                onError(e, _file)
            }
        })
        .finally(() => {
            onChange && onChange(_file)
        })
    }
    return (
        <div className="upload-component">
            <div className="upload-input" onClick={handleClick} style={{ display: 'inline-block'}}>
                {
                    drag ? 
                    <Dragger onFile={(files) => {uploadFiles(files)}}>{children}</Dragger> :
                    children
                }
                <input
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange} 
                ref={inputFileRef} 
                style={{display: 'none'}} 
                className="file-input" 
                type="file" 
                />
            </div>
            <UploadList fileList={fileList} onRemove={handleRemove} />
        </div>
    )
}
export default Upload