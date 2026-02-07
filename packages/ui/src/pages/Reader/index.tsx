import EpubNavigation from '@components/EpubNavigation'
import Show from '@components/Show'
import Spin from '@components/Spin'
import { Typography } from '@components/Typography'
import clsx from 'clsx'
import { FC, memo, useRef } from 'react'

export interface IProps {
  pageInfo: { current: number; total: number; percentage: number }
  loading: boolean
  onHideHeader: () => void
  onShowHeader: () => void
  onClickNextChapter: () => void
  onClickPrevChapter: () => void
  onClickNextPage: () => void
  onClickPrevPage: () => void
  hideContent: boolean
}

const Reader: FC<IProps> = ({
  hideContent,
  pageInfo,
  loading,
  onHideHeader,
  onShowHeader,
  onClickNextChapter,
  onClickPrevChapter,
  onClickNextPage,
  onClickPrevPage,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  return (
    <main className="w-full h-full flex flex-col relative">
      <EpubNavigation
        onClickNextChapter={onClickNextChapter}
        onClickPrevChapter={onClickPrevChapter}
        onClickNextPage={onClickNextPage}
        onClickPrevPage={onClickPrevPage}
        hideContent={hideContent}>
        <div className="h-full relative">
          <Show when={loading}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Spin />
            </div>
          </Show>
          <div
            onMouseLeave={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onShowHeader()
            }}
            onMouseEnter={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onHideHeader()
            }}
            ref={containerRef}
            className={clsx(
              loading ? 'opacity-0' : 'opacity-100',
              'book-content rounded bg-white relative w-full h-full',
            )}
          />
        </div>
        <div className="absolute bottom-[20px] right-[20px]">
          <Typography text="caption" color="muted">
            {pageInfo.current} / {pageInfo.total} ({pageInfo.percentage.toFixed(2)}%)
          </Typography>
        </div>
      </EpubNavigation>
    </main>
  )
}

export default memo(Reader)
