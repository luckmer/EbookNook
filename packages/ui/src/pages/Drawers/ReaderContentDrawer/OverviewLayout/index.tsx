import ImgCover from '@components/ImgCover'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import { Skeleton } from 'antd'
import type { FC } from 'react'

export interface IBook {
  description?: string
  cover?: string
  author?: string
  title?: string
  published?: string
  publisher?: string
}

export interface IProps {
  onImgError: () => void
  book: IBook
  isLoader: boolean
  hasLoadError: boolean
}

const OverviewLayout: FC<IProps> = ({ book, isLoader, hasLoadError, onImgError }) => {
  return (
    <Show
      when={!isLoader}
      fallback={
        <div className='pr-24'>
          <Skeleton active />
        </div>
      }>
      <div className='flex flex-row gap-12'>
        <Show
          when={!hasLoadError}
          fallback={
            <div className='w-[45px] h-[60px] object-cover rounded-4 pointer-events-none select-none'>
              <ImgCover name={book.title ?? '--'} author={book.author ?? '--'} />
            </div>
          }>
          <img
            aria-label='img'
            className='w-[45px] h-[60px] object-cover rounded-4 pointer-events-none select-none'
            src={book.cover}
            onError={(e) => {
              e.stopPropagation()
              onImgError()
            }}
          />
        </Show>
        <div className='flex flex-col gap-6'>
          <Typography>{book.title ?? 'Unknown title'}</Typography>
          <Typography text='small' color='secondary'>
            {book.author ?? 'Unknown author'}
          </Typography>
        </div>
      </div>
    </Show>
  )
}

export default OverviewLayout
