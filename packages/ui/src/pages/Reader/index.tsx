import { FC, useEffect, useRef, useState } from 'react'
import { Chapter } from '@interfaces/book/interfaces'
import { Frame } from '@libs/Frame/FrameCore'
import { Typography } from '@components/Typography'
import DefaultButton from '@components/Buttons/DefaultButton'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

export interface IProps {
  chapters: Chapter[]
  selectedChapter: string
}

const Reader: FC<IProps> = ({ chapters, selectedChapter }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 1 })
  const viewRef = useRef<Frame | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chapter =
      chapters.find((c) => c.href.endsWith(selectedChapter.split('#')[0])) ?? chapters[0]
    if (!chapter) return

    if (!viewRef.current) {
      viewRef.current = new Frame({
        container,
        onExpand: (current, total) => setPageInfo({ current, total }),
      })
    }

    const view = viewRef.current

    view.load(chapter, selectedChapter).then(() => {
      new Promise((resolve) => setTimeout(resolve, 50)).then(() => {
        view.element.style.visibility = 'visible'
      })
    })

    return () => {
      return
    }
  }, [selectedChapter, chapters])

  return (
    <main className="w-full h-full p-24 flex flex-col">
      <div
        ref={containerRef}
        className="rounded bg-white shadow-inner relative w-full h-full overflow-hidden"
      />

      <div className="flex flex-row justify-between w-full">
        <DefaultButton
          onClick={() => viewRef.current?.prevPage()}
          className="transition-colors hover:bg-black-300 hover:text-white-100 text-white-200 duration-300 rounded-4 px-6 py-6">
          <FaChevronLeft className=" fill-white-100 w-18 h-18 group-hover:fill-hover-grey-blue-200 transition-colors duration-200" />
        </DefaultButton>
        <Typography>
          {pageInfo.current} / {pageInfo.total}
        </Typography>
        <DefaultButton
          onClick={() => viewRef.current?.nextPage()}
          className="transition-colors hover:bg-black-300 hover:text-white-100 text-white-200 duration-300 rounded-4 px-6 py-6">
          <FaChevronRight className=" fill-white-100 w-18 h-18 group-hover:fill-hover-grey-blue-200 transition-colors duration-200" />
        </DefaultButton>
      </div>
    </main>
  )
}

export default Reader
