import React  from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { action } from '@storybook/addon-actions';
import Upload from './upload'
import Button from '../Button/button'
import Icon from '../Icon/icon'

const meta: Meta<typeof Upload> = {
    title: 'Upload',
    component: Upload,
    tags: ['autodocs'],
} as Meta<typeof Upload>

export default meta

export const ASimpleUpload: StoryFn = (args) => (
    <Upload
      {...args}
      action="https://run.mocky.io/v3/c46a7d81-6ffe-493a-b14b-f8402a96329e"
      onProgress={action('progress')}
      onSuccess={action('success')}
      onError={action('error')}
      onChange={action('changed')}
    >
      <Button size="lg" btnType="primary"><Icon icon="upload" /> 点击上传 </Button>
    </Upload>  
  )
  ASimpleUpload.storyName = '普通的 Upload 组件'

  export const BCheckUpload: StoryFn = (args) => {
    const checkFileSize = (file: File) => {
      if (Math.round(file.size / 1024) > 50) {
        alert('file too big')
        return false;
      }
      return true;
    }
    return (
      <Upload
        {...args}
        action="https://run.mocky.io/v3/c46a7d81-6ffe-493a-b14b-f8402a96329e"
        beforeUpload={checkFileSize}
      >
        <Button size="lg" btnType="primary"><Icon icon="upload" /> 不能传大于50Kb！ </Button>
      </Upload>  
    )
  }
  BCheckUpload.storyName = '上传前检查文件大小'

  export const CDragUpload: StoryFn = (args) => (
    <Upload
      {...args}
      action="https://run.mocky.io/v3/c46a7d81-6ffe-493a-b14b-f8402a96329e"
      name="fileName"
      multiple
      drag
    >
      <Icon icon="upload" size="5x" theme="secondary" />
      <br/>
      <p>点击或者拖动到此区域进行上传</p>
    </Upload>
  )
  CDragUpload.storyName = '拖动上传'
