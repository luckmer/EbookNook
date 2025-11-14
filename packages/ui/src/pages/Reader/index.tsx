import { FC, useEffect, useRef, useState } from 'react'
import { Chapter } from '@interfaces/book/interfaces'
import { Frame } from '@libs/Frame/FrameCore'

export interface IProps {
  chapters: Chapter[]
  onClickBack: () => void
}

const Reader: FC<IProps> = ({ chapters, onClickBack }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 1 })
  const currentChapter = chapters[12]?.id
  const viewRef = useRef<Frame | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !currentChapter) return

    const chapter = chapters.find((c) => c.id === currentChapter)
    if (!chapter) return

    if (viewRef.current) viewRef.current.destroy()
    const view = new Frame({
      container,
      onExpand: (current, total) => setPageInfo({ current, total }),
    })

    viewRef.current = view
    view.load(chapter.content)

    return () => view.destroy()
  }, [currentChapter, chapters])

  return (
    <div>
      <div
        onClick={() => {
          onClickBack()
        }}>
        back
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
