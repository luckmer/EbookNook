import EpubNavigation from '@components/EpubNavigation'
import { Epub } from '@libs/epub/epub'
import { FC, memo, useEffect, useRef, useState } from 'react'

export interface IProps {
  epubCodeSearch: string
  selectedChapter: string
}

const Reader: FC<IProps> = ({ epubCodeSearch, selectedChapter }) => {
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

  return (
    <main className="w-full h-full p-24 flex flex-col">
      <EpubNavigation
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
          ref={containerRef}
          className="book-content rounded bg-white shadow-inner relative w-full h-full overflow-hidden"
        />
      </EpubNavigation>
    </main>
  )
}

export default memo(Reader)
