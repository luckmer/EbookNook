import Show from '@components/Show'
import { FC, memo } from 'react'

export interface IProps {
  onChange: (value: string) => void
  isEditing: boolean
  placeholder: string
  children: React.ReactNode
  value: string
}

const ContentArea: FC<IProps> = ({ isEditing, children, placeholder, value, onChange }) => {
  return (
    <Show when={isEditing} fallback={children}>
      <textarea
        className="bg-surface-200/20 h-full w-full py-8 rounded-4 px-12 font-ubuntu border border-border-subtle  min-h-[200px]"
        onChange={(e) => {
          e.stopPropagation()
          onChange(e.target.value)
        }}
        value={value}
        placeholder={placeholder}
      />
    </Show>
  )
}

export default memo(ContentArea)
