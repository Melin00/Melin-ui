import React, { DragEvent, FC, ReactNode, useState } from "react";
import classNames from 'classnames';

interface DraggerProps {
    onFile:(files: FileList) => void
    children: ReactNode
}

const Dragger:FC<DraggerProps> = ({onFile, children}) => {
    const [dragOver, setDragOver] = useState(false)
    const kclass = classNames('uploader-dragger', {
        'is-dragover': dragOver
    })
    const handleDrop = (e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        setDragOver(false)
        console.log('inside drag', e.dataTransfer.files)
        onFile(e.dataTransfer.files)
    }
    const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
        e.preventDefault()
        setDragOver(over)
    }
    return (
        <div 
        className={kclass}
        onDragOver={(e) => { handleDrag(e, true) }}
        onDragLeave={(e) => { handleDrag(e, false) }}
        onDrop={handleDrop}
        >
            {children}
        </div>
    )
}

export default Dragger