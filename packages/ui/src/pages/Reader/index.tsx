import EpubNavigation from '@components/EpubNavigation'
import { Epub } from '@libs/epub/epub'
import { FC, memo, useEffect, useRef, useState } from 'react'
import { ISettingsState } from '@interfaces/settings/interfaces'

export interface IProps {
  epubCodeSearch: string
  selectedChapter: string
  onHideHeader: () => void
  onShowHeader: () => void
  hideContent: boolean
  settings: ISettingsState
}

const Reader: FC<IProps> = ({
  epubCodeSearch,
  selectedChapter,
  hideContent,
  onHideHeader,
  onShowHeader,
  settings,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 1 })
  const viewRef = useRef<Epub | null>(null)

  useEffect(() => {
    if (!viewRef.current && epubCodeSearch.length > 0) {
      const book_epub = new Epub(epubCodeSearch)

      book_epub.renderTo('.book-content')

      viewRef.current = book_epub
    }

    viewRef.current?.display(selectedChapter)
    viewRef.current?.progress((current, total) => {
      setPageInfo({ current, total })
    })
  }, [epubCodeSearch, selectedChapter])

  useEffect(() => {
    viewRef?.current?.setStyles(settings)
  }, [settings, epubCodeSearch, selectedChapter])

  return (
    <main className="w-full h-full  flex flex-col">
      <EpubNavigation
        hideContent={hideContent}
        currentPage={pageInfo.current}
        totalPage={pageInfo.total}
        onClickNextChapter={() => {
          viewRef.current?.nextChapter()
        }}
        onClickPrevChapter={() => {
          viewRef.current?.prevChapter()
        }}
        onClickPrevPage={() => {
          viewRef.current?.prevPage()
        }}
        onClickNextPage={() => {
          viewRef.current?.nextPage()
        }}>
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
          className="book-content rounded bg-white shadow-inner relative w-full h-full overflow-hidden"
        />
      </EpubNavigation>
    </main>
  )
}

export default memo(Reader)
