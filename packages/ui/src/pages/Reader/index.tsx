import { FC, useEffect, useRef, useState } from 'react'
import { Chapter } from '@interfaces/book/interfaces'
import { Frame } from '@libs/Frame/FrameCore'
import { Typography } from '@components/Typography'

export interface IProps {
  chapters: Chapter[]
  selectedChapter: string
  onClickBack: () => void
}

const Reader: FC<IProps> = ({ chapters, onClickBack, selectedChapter }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 1 })
  const viewRef = useRef<Frame | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chapter =
      chapters.find((c) => c.href.endsWith(selectedChapter.split('#')[0])) ?? chapters[0]

    if (!chapter) return

    if (viewRef.current) viewRef.current.destroy()

    const view = new Frame({
      container,
      onExpand: (current, total) => setPageInfo({ current, total }),
    })
    viewRef.current = view

    view.load(chapter, selectedChapter)

    return () => view.destroy()
  }, [selectedChapter, chapters])

  return (
    <div className="reader-wrapper">
      <Typography>
        {pageInfo.current} / {pageInfo.total}
      </Typography>
      <div
        onClick={() => {
          onClickBack()
        }}
        className="cursor-pointer text-blue-600 my-2">
        ← Back
      </div>
      <div
        ref={containerRef}
        className="border rounded bg-white shadow-inner relative"
        style={{ width: '100%', height: '80vh', overflow: 'hidden' }}
      />
    </div>
  )
}

export default Reader
