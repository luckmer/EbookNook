import Show from '@components/Show'
import { Typography } from '@components/Typography'
import { formatDate } from '@web-utils/index'
import clsx from 'clsx'
import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import DefaultInput from '../DefaultInput'
export interface IProps {
  onChange: (value: string) => void
  isEditing: boolean
  placeholder: string
  children: React.ReactNode
  value: string
  isError?: boolean
}

const DateContentInput: FC<IProps> = ({
  isEditing,
  children,
  placeholder,
  value,
  isError,
  onChange,
}) => {
  const { t } = useTranslation()
  return (
    <Show when={isEditing} fallback={children}>
      <DefaultInput
        className={clsx(
          isError ? 'border-accent-red' : 'border-border-subtle',
          'bg-surface-200/20 h-full w-full py-8 rounded-4 px-12 font-ubuntu border ',
        )}
        onChange={(val) => onChange(formatDate(val))}
        value={value}
        placeholder={placeholder}
      />
      <Show when={isError ?? false}>
        <Typography color="error" text="small">
          {t('enterValidDate')}
        </Typography>
      </Show>
    </Show>
  )
}

export default memo(DateContentInput)
