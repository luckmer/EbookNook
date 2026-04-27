import { IBindingsBookContent } from '@bindings/book'
import DefaultButton from '@components/Buttons/DefaultButton'
import ContentArea from '@components/Inputs/ContentArea'
import ContentInput from '@components/Inputs/ContentInput'
import DateContentInput from '@components/Inputs/DateContentInput'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import Show from '@components/Show'
import Spin from '@components/Spin'
import { Typography } from '@components/Typography'
import { useWindowSize } from '@hooks/useWindowSize'
import { BOOK_STATUS } from '@interfaces/book/enums'
import { DATE_REGEX } from '@web-utils/regex'
import clsx from 'clsx'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoTrashBin } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'

export interface IBook {
  bookDescription?: string
  cover?: string
  author?: string
  title?: string
  published?: string
  publisher?: string
  status: BOOK_STATUS
}

export interface IProps {
  onClickEdit: (newContent: Partial<Record<IBindingsBookContent, string>>) => void
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
  const [newContent, setNewContent] = useState<Partial<Record<IBindingsBookContent, string>>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isError, setIsError] = useState(false)
  const { width } = useWindowSize()
  const isMobile = useMemo(() => width <= 700, [width])
  const { t } = useTranslation()

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
      isFullscreen={isMobile}
      width={isMobile ? '100%' : 500}
      height={isMobile ? '100%' : undefined}
      closable={false}>
      <div
        className={clsx(
          'flex flex-col  h-full w-full overflow-hidden',
          isMobile ? 'h-full' : 'max-h-[700px]',
        )}>
        <ModalHeader onClickClose={onClickClose} label={t('bookOverview')} />
        <div className="flex flex-col overflow-hidden w-full flex-1 py-24">
          <div className="flex flex-row items-center justify-end gap-12 w-full px-24 pb-12">
            <DefaultButton
              disabled={book.status === BOOK_STATUS.DELETING}
              onClick={onClickDelete}
              className={clsx(
                'p-6  rounded-4 duration-150',
                book.status !== BOOK_STATUS.DELETING
                  ? 'hover:bg-button-primary-hover cursor-pointer'
                  : 'cursor-default!',
              )}>
              <Show when={book.status !== BOOK_STATUS.DELETING} fallback={<Spin size={18} />}>
                <IoTrashBin className="text-status-error min-w-18 min-h-18" />
              </Show>
            </DefaultButton>
            <DefaultButton
              disabled={book.status === BOOK_STATUS.UPDATING}
              onClick={() => {
                setIsEditing((prev) => !prev)
              }}
              className={clsx(
                'p-6  rounded-4 duration-150',
                book.status !== BOOK_STATUS.UPDATING
                  ? 'hover:bg-button-primary-hover cursor-pointer'
                  : 'cursor-default!',
              )}>
              <Show when={book.status !== BOOK_STATUS.UPDATING} fallback={<Spin size={18} />}>
                <MdEdit className="min-w-18 min-h-18" />
              </Show>
            </DefaultButton>
          </div>
          <div className="flex flex-col gap-24 overflow-y-auto px-24">
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
                      placeholder={t('author')}
                      value={newContent['author'] ?? book?.author ?? ''}
                      onChange={(val) => {
                        setNewContent((prev) => ({ ...prev, ['author']: val }))
                      }}>
                      <Typography text="h2">{book?.author || t('unknownAuthor')}</Typography>
                    </ContentInput>
                    <ContentInput
                      isEditing={isEditing}
                      placeholder={t('title')}
                      value={newContent['title'] ?? book?.title ?? ''}
                      onChange={(val) => {
                        setNewContent((prev) => ({ ...prev, ['title']: val }))
                      }}>
                      <Typography text="caption" color="secondary">
                        {book?.title || t('unknownTitle')}
                      </Typography>
                    </ContentInput>
                  </div>
                  <div className="flex flex-col gap-8 w-full">
                    <DateContentInput
                      isError={isError}
                      isEditing={isEditing}
                      placeholder={t('date')}
                      value={newContent['published'] ?? book?.published ?? ''}
                      onChange={(val) => {
                        setIsError(false)
                        setNewContent((prev) => ({
                          ...prev,
                          ['published']: val,
                        }))
                      }}>
                      <Typography text="body">{book?.published || t('unknownDate')}</Typography>
                    </DateContentInput>
                    <ContentInput
                      isEditing={isEditing}
                      placeholder={t('publisher')}
                      value={newContent['publisher'] ?? book?.publisher ?? ''}
                      onChange={(val) => {
                        setNewContent((prev) => ({
                          ...prev,
                          ['publisher']: val,
                        }))
                      }}>
                      <Typography text="caption" color="secondary">
                        {book?.publisher || t('unknownPublisher')}
                      </Typography>
                    </ContentInput>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-12">
              <Show when={!isEditing}>
                <Typography text="body" color="white">
                  {t('description')}
                </Typography>
              </Show>
              <ContentArea
                isEditing={isEditing}
                placeholder={t('description')}
                onChange={(val) => {
                  setNewContent((prev) => ({ ...prev, ['description']: val }))
                }}
                value={newContent['description'] ?? bookDesc ?? ''}>
                <Show when={!bookDesc}>
                  <Typography text="caption" color="secondary">
                    {t('noDescription')}
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
                  disabled={book.status === BOOK_STATUS.UPDATING}
                  onClick={() => {
                    const date = newContent['published']
                    if ((date?.trim()?.length ?? 0) > 0) {
                      if (!date?.match(DATE_REGEX)) {
                        setIsError(true)
                        return
                      }
                    }
                    setIsEditing(false)
                    onClickEdit(newContent)
                  }}
                  className="px-24 py-8 bg-button-primary-active hover:bg-button-primary-hover rounded-4 duration-150 h-full">
                  <Show when={book.status !== BOOK_STATUS.UPDATING} fallback={<Spin size={16} />}>
                    <Typography text="caption" color="secondary">
                      {t('save')}
                    </Typography>
                  </Show>
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
