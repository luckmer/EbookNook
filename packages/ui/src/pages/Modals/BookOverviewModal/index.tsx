import DefaultButton from '@components/Buttons/DefaultButton'
import ContentArea from '@components/Inputs/ContentArea'
import ContentInput from '@components/Inputs/ContentInput'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import clsx from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'
import { IoTrashBin } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { NEW_EPUB_BOOK_CONTENT } from '@interfaces/book/enums'
import DateContentInput from '@components/Inputs/DateContentInput'
import { DATE_REGEX } from '@web-utils/regex'

export interface IBook {
  bookDescription?: string
  cover?: string
  author?: string
  title?: string
  published?: string
  publisher?: string
}

export interface IProps {
  onClickEdit: (newContent: Partial<Record<NEW_EPUB_BOOK_CONTENT, string>>) => void
  onClickDelete: () => void
  onClickClose: () => void
  isOpen: boolean
  book: IBook
}

const BookOverviewModal: FC<IProps> = ({
  onClickClose,
  onClickDelete,
  onClickEdit,
  isOpen,
  book,
}) => {
  const [newContent, setNewContent] = useState<Partial<Record<NEW_EPUB_BOOK_CONTENT, string>>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isError, setIsError] = useState(false)

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

  useEffect(() => {
    if (isOpen) {
      setIsEditing(false)
      setIsError(false)
      setNewContent({})
    }
  }, [isOpen])

  return (
    <Modal
      isFooter={false}
      onClickClose={onClickClose}
      isOpen={isOpen}
      centered
      width={500}
      closable={false}>
      <div className="flex flex-col  h-full w-full overflow-hidden max-h-[700px]">
        <ModalHeader onClickClose={onClickClose} label="Book overview" />
        <div className="flex flex-col overflow-y-auto w-full flex-1 p-24">
          <div className="flex flex-row items-center justify-end gap-12 w-full">
            <DefaultButton
              onClick={onClickDelete}
              className="p-6 hover:bg-button-primary-hover rounded-4 duration-150">
              <IoTrashBin className="text-status-error min-w-18 min-h-18" />
            </DefaultButton>
            <DefaultButton
              onClick={() => {
                setIsEditing((prev) => !prev)
              }}
              className="p-6 hover:bg-button-primary-hover rounded-4 duration-150">
              <MdEdit className="min-w-18 min-h-18" />
            </DefaultButton>
          </div>
          <div className="flex flex-col gap-24">
            <div className="flex flex-row gap-24">
              <img
                src={book.cover}
                alt="cover"
                loading="lazy"
                className="rounded-6  max-h-[200px] min-h-[200px] min-w-[130px] max-w-[130px] object-cover bg-neutral-800"
              />
              <div className="flex flex-col justify-between items-start py-4 w-full">
                <div className="flex flex-col gap-24 py-4 w-full">
                  <div className="flex flex-col gap-8 w-full">
                    <ContentInput
                      isEditing={isEditing}
                      placeholder="Author"
                      value={newContent[NEW_EPUB_BOOK_CONTENT.AUTHOR] ?? book?.author ?? ''}
                      onChange={(val) => {
                        setNewContent((prev) => ({ ...prev, [NEW_EPUB_BOOK_CONTENT.AUTHOR]: val }))
                      }}>
                      <Typography text="h2">{book?.author || 'Unknown Author'}</Typography>
                    </ContentInput>
                    <ContentInput
                      isEditing={isEditing}
                      placeholder="Title"
                      value={newContent[NEW_EPUB_BOOK_CONTENT.TITLE] ?? book?.title ?? ''}
                      onChange={(val) => {
                        setNewContent((prev) => ({ ...prev, [NEW_EPUB_BOOK_CONTENT.TITLE]: val }))
                      }}>
                      <Typography text="caption" color="secondary">
                        {book?.title || 'Unknown title'}
                      </Typography>
                    </ContentInput>
                  </div>
                  <div className="flex flex-col gap-8 w-full">
                    <DateContentInput
                      isError={isError}
                      isEditing={isEditing}
                      placeholder="Date"
                      value={newContent[NEW_EPUB_BOOK_CONTENT.PUBLISHED] ?? book?.published ?? ''}
                      onChange={(val) => {
                        setIsError(false)
                        setNewContent((prev) => ({
                          ...prev,
                          [NEW_EPUB_BOOK_CONTENT.PUBLISHED]: val,
                        }))
                      }}>
                      <Typography text="body">{book?.published || 'Unknown date'}</Typography>
                    </DateContentInput>
                    <ContentInput
                      isEditing={isEditing}
                      placeholder="Publisher"
                      value={newContent[NEW_EPUB_BOOK_CONTENT.PUBLISHER] ?? book?.publisher ?? ''}
                      onChange={(val) => {
                        setNewContent((prev) => ({
                          ...prev,
                          [NEW_EPUB_BOOK_CONTENT.PUBLISHER]: val,
                        }))
                      }}>
                      <Typography text="caption" color="secondary">
                        {book?.publisher || 'Unknown publisher'}
                      </Typography>
                    </ContentInput>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-12">
              <Show when={!isEditing}>
                <Typography text="body" color="white">
                  Description
                </Typography>
              </Show>
              <ContentArea
                isEditing={isEditing}
                placeholder="Description"
                onChange={(val) => {
                  setNewContent((prev) => ({ ...prev, [NEW_EPUB_BOOK_CONTENT.DESCRIPTION]: val }))
                }}
                value={newContent[NEW_EPUB_BOOK_CONTENT.DESCRIPTION] ?? bookDesc ?? ''}>
                <Show when={!bookDesc}>
                  <Typography text="caption" color="secondary">
                    No description
                  </Typography>
                </Show>
              </ContentArea>
              <div className={clsx('w-full', (!bookDesc || isEditing) && 'hidden')}>
                <iframe
                  title="book-description"
                  ref={refIframe}
                  scrolling="no"
                  className="w-full border-0 transition-all duration-200"
                />
              </div>
            </div>
            <Show when={isEditing}>
              <div>
                <DefaultButton
                  onClick={() => {
                    const date = newContent[NEW_EPUB_BOOK_CONTENT.PUBLISHED]
                    if ((date?.trim()?.length ?? 0) > 0) {
                      if (!date?.match(DATE_REGEX)) {
                        setIsError(true)
                        return
                      }
                    }
                    onClickEdit(newContent)
                  }}
                  className="px-24 py-8 bg-button-primary-active hover:bg-button-primary-hover rounded-4 duration-150 h-full">
                  <Typography text="caption" color="secondary">
                    Save
                  </Typography>
                </DefaultButton>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default BookOverviewModal
