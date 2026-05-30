import DefaultButton from '@components/Buttons/DefaultButton'
import ContentInput from '@components/Inputs/ContentInput'
import Show from '@components/Show'
import Spin from '@components/Spin'
import { Typography } from '@components/Typography'
import clsx from 'clsx'
import { type FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdDelete, MdModeEditOutline } from 'react-icons/md'
export interface IProps {
  title: string
  chapter: string
  createdAt: string
  isUpdatingBookmark: boolean
  isDeletingBookmark: boolean
  onClick: () => void
  onClickDelete: () => void
  onClickEdit: (label: string) => void
}

const Bookmark: FC<IProps> = ({
  onClick,
  onClickDelete,
  onClickEdit,
  chapter,
  title,
  createdAt,
  isDeletingBookmark,
  isUpdatingBookmark,
}) => {
  const [label, setLabel] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const { t } = useTranslation()

  const date = useMemo(() => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const d = new Date(+createdAt)
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${d.getDate()} ${t(months[d.getMonth()].toLocaleLowerCase())} ${d.getFullYear()} ${t('at')} ${h}:${m}`
  }, [createdAt, t])

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onClick()
      }}
      className='group rounded-8 border bg-base  border-border-popover cursor-pointer overflow-hidden transition-colors duration-150'>
      <div className='flex items-stretch'>
        <div className='flex flex-col gap-4 flex-1 min-w-0 px-14 py-12'>
          <Show when={!isEdit}>
            <Typography text='caption' ellipsis>
              {chapter}
            </Typography>
          </Show>
          <ContentInput isEditing={isEdit} placeholder={title} value={label} onChange={setLabel}>
            <Typography text='caption' ellipsis>
              {title}
            </Typography>
          </ContentInput>
          <Show when={!isEdit}>
            <Typography text='caption' ellipsis>
              {date}
            </Typography>
          </Show>
        </div>
      </div>
      <div
        className={clsx(
          isEdit && 'grid-rows-[1fr]  border-t! border-border-subtle',
          'grid transition-all duration-200 ease-out grid-rows-[0fr] group-hover:grid-rows-[1fr] border-t-0 group-hover:border-t border-border-subtle',
        )}>
        <div className='overflow-hidden'>
          <Show
            when={!isEdit}
            fallback={
              <div className='flex gap-2 p-6 justify-end items-center'>
                <DefaultButton
                  onClick={() => {
                    setIsEdit(false)
                    setLabel('')
                  }}
                  className='transition-colors hover:bg-button-primary-hover duration-300 rounded-4 px-6 py-6'>
                  <Typography text='caption' color='blue'>
                    {t('cancel')}
                  </Typography>
                </DefaultButton>
                <DefaultButton
                  disabled={!label.trim().length || isUpdatingBookmark}
                  onClick={() => {
                    onClickEdit(label)
                    setIsEdit(false)
                    setLabel('')
                  }}
                  className='transition-colors hover:bg-button-primary-hover  duration-300 rounded-4 px-6 py-6'>
                  <Typography text='caption' color='blue'>
                    <Show when={!isUpdatingBookmark} fallback={<Spin size={18} />}>
                      {t('save')}
                    </Show>
                  </Typography>
                </DefaultButton>
              </div>
            }>
            <div className='flex gap-2 p-6 justify-end items-center'>
              <DefaultButton
                disabled={isUpdatingBookmark}
                onClick={() => {
                  setIsEdit(true)
                }}
                className='transition-colors hover:bg-button-primary-hover hover:text-accent-blue text-accent-blue duration-300 rounded-4 px-6 py-6'>
                <Show when={!isUpdatingBookmark} fallback={<Spin size={18} />}>
                  <MdModeEditOutline className='w-18 h-18 transition-colors duration-200' />
                </Show>
              </DefaultButton>
              <DefaultButton
                disabled={isDeletingBookmark}
                onClick={onClickDelete}
                className='transition-colors hover:bg-button-primary-hover hover:text-shadow-accent-red text-accent-red duration-300 rounded-4 px-6 py-6'>
                <Show when={!isDeletingBookmark} fallback={<Spin size={18} />}>
                  <MdDelete className='w-18 h-18 transition-colors duration-200' />
                </Show>
              </DefaultButton>
            </div>
          </Show>
        </div>
      </div>
    </div>
  )
}

export default Bookmark
