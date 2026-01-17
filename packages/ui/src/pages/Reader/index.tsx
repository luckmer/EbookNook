import EpubNavigation from '@components/EpubNavigation'
import Show from '@components/Show'
import Spin from '@components/Spin'
import clsx from 'clsx'
import { FC, memo, useRef } from 'react'

export interface IProps {
  pageInfo: { current: number; total: number }
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
    <main className="w-full h-full flex flex-col">
      <EpubNavigation
        onClickNextChapter={onClickNextChapter}
        onClickPrevChapter={onClickPrevChapter}
        onClickNextPage={onClickNextPage}
        onClickPrevPage={onClickPrevPage}
        currentPage={pageInfo.current}
        hideContent={hideContent}
        totalPage={pageInfo.total}>
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
              loading && 'h-0',
              'book-content rounded bg-white relative w-full h-full overflow-hidden',
            )}
          />
        </div>
      </EpubNavigation>
    </main>
  )
}

export default memo(Reader)
