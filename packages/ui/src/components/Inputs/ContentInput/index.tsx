import Show from '@components/Show'
import { FC, memo } from 'react'
import DefaultInput from '../DefaultInput'

export interface IProps {
  onChange: (value: string) => void
  isEditing: boolean
  placeholder: string
  children: React.ReactNode
  value: string
}

const ContentInput: FC<IProps> = ({ isEditing, children, placeholder, value, onChange }) => {
  return (
    <Show when={isEditing} fallback={children}>
      <DefaultInput
        className="bg-surface-200/20 h-full w-full py-8 rounded-4 px-12 font-ubuntu border border-border-subtle"
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </Show>
  )
}

export default memo(ContentInput)
