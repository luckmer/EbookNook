import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import clsx from 'clsx'
import { FC, useEffect, useRef } from 'react'

export interface IBook {
  bookDescription?: string
  cover?: string
  author?: string
  title?: string
  published?: string
  publisher?: string
}

export interface IProps {
  onClickClose: () => void
  book: IBook
  isOpen: boolean
}

const BookOverviewModal: FC<IProps> = ({ onClickClose, isOpen, book }) => {
  const refIframe = useRef<HTMLIFrameElement>(null)
  const bookDesc = book.bookDescription

  useEffect(() => {
    if (!isOpen || !bookDesc || !refIframe.current) return

    const iframe = refIframe.current
    const blob = new Blob([bookDesc], { type: 'text/html' })
    const url = URL.createObjectURL(blob)

    let observer: ResizeObserver | null = null

    const handleLoad = () => {
      const doc = iframe.contentDocument
      if (!doc || !doc.body) return

      const style = doc.createElement('style')
      style.textContent = `
      body { 
        margin: 0; padding: 0; color: white; 
        font-family: system-ui, -apple-system, sans-serif; 
        font-size: 14px; line-height: 1.5; overflow: hidden; 
        * { 
          color: #9CA3AF; 
        }
      }
    `
      doc.head.appendChild(style)

      observer = new ResizeObserver(() => {
        if (doc.body) {
          iframe.style.height = `${doc.body.scrollHeight}px`
        }
      })

      observer.observe(doc.body)
    }

    iframe.addEventListener('load', handleLoad)
    iframe.src = url

    return () => {
      iframe.removeEventListener('load', handleLoad)
      URL.revokeObjectURL(url)

      if (observer) {
        observer.disconnect()
      }
    }
  }, [bookDesc, isOpen])

  return (
    <Modal
      isFooter={false}
      onClickClose={onClickClose}
      isOpen={isOpen}
      centered
      width={500}
      closable={false}>
      <div className="flex flex-col gap-[20px] h-full w-full overflow-hidden max-h-[700px]">
        <ModalHeader onClickClose={onClickClose} label="Book overview" />
        <div className="flex flex-col gap-24 overflow-y-auto w-full flex-1 p-24">
          <div className="flex flex-row gap-24">
            <img
              src={book.cover}
              alt="cover"
              loading="lazy"
              className="rounded-6  max-h-[200px] min-h-[200px] min-w-[130px] max-w-[130px] object-cover bg-neutral-800"
            />
            <div className="flex flex-col justify-between py-4">
              <div className="flex flex-col gap-8">
                <Typography text="h2">{book?.author || 'Unknown Author'}</Typography>
                <Typography text="caption" color="secondary">
                  {book?.title || 'Unknown title'}
                </Typography>
              </div>
              <div className="flex flex-col gap-8">
                <Typography text="body">{book?.published || 'Unknown date'}</Typography>
                <Typography text="caption" color="secondary">
                  {book?.publisher || 'Unknown publisher'}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-12">
            <Typography text="body" color="white">
              Description
            </Typography>
            <Show when={!bookDesc}>
              <Typography text="caption" color="secondary">
                No description
              </Typography>
            </Show>
            <div className={clsx('w-full', !bookDesc && 'hidden')}>
              <iframe
                title="book-description"
                ref={refIframe}
                scrolling="no"
                className="w-full border-0 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default BookOverviewModal
