import type { IBindingsBookmark } from '@bindings/bookmarks'
import type { IBindingsNote } from '@bindings/notes'
import DefaultButton from '@components/Buttons/DefaultButton'
import Drawer from '@components/Drawer'
import Match from '@components/Match'
import Switch from '@components/Switch'
import { Typography } from '@components/Typography'
import { useWindowSize } from '@hooks/useWindowSize'
import { OPTIONS } from '@interfaces/contentDrawer/enums'
import { LOADER_STATE, LOADER_STATUS } from '@interfaces/ui/enums'
import type { LoaderState } from '@interfaces/ui/types'
import { Segmented } from 'antd'
import { type FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoLibraryOutline } from 'react-icons/io5'
import AnnotationsLayout from './AnnotationsLayout'
import ContentsLayout from './ContentsLayout'
import OverviewLayout from './OverviewLayout'
export interface ITocItem {
  label: string
  href?: string
  id?: string
  subitems?: ITocItem[]
}

export interface IBook {
  description?: string
  cover?: string
  author?: string
  title?: string
  published?: string
  publisher?: string
}

export interface IProps {
  onClick: (href: string) => void
  onClickClose: () => void
  onClickBack: () => void
  onClickNote: (note: IBindingsNote) => void
  onClickBookmark: (bookmark: IBindingsBookmark) => void
  onClickDelete: (id: string, cfi: string) => void
  onClickDeleteNote: (id: string, noteId: string, page: string) => void
  onClickEditNote: (note: IBindingsNote) => void
  onClickEdit: (bookmark: IBindingsBookmark) => void
  isOpen: boolean
  toc: ITocItem[]
  loaderState: Partial<Record<LOADER_STATE, LoaderState>>
  scopedLoader: Partial<Record<string, Partial<Record<LOADER_STATE, LoaderState>>>>
  bookmarks: Array<IBindingsBookmark>
  notes: Array<IBindingsNote>
  activeToc: ITocItem
  book: IBook
}
const ReaderContentDrawer: FC<IProps> = ({
  isOpen,
  onClickClose,
  onClickBack,
  onClickBookmark,
  onClickDelete,
  onClickNote,
  onClickDeleteNote,
  onClickEditNote,
  onClickEdit,
  onClick,
  book,
  toc,
  loaderState,
  notes,
  activeToc,
  bookmarks,
  scopedLoader,
}) => {
  const [option, setOption] = useState<OPTIONS>(OPTIONS.OVERVIEW)
  const [hasLoadError, setHasLoadError] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setHasLoadError(false)
  }, [])

  const { width } = useWindowSize()
  const isMobile = useMemo(() => width <= 700, [width])

  return (
    <Drawer
      onClickClose={onClickClose}
      isOpen={isOpen}
      placement={isMobile ? 'bottom' : 'left'}
      height={isMobile ? '80%' : '100%'}>
      <div className='h-full flex flex-col overflow-hidden'>
        <div className='flex flex-col gap-24 shrink-0 pb-12'>
          <div>
            <DefaultButton
              onClick={onClickBack}
              className='transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6'>
              <IoLibraryOutline className='w-24 h-24 transition-colors duration-200' />
            </DefaultButton>
          </div>
          <div className='pb-12 pr-24'>
            <Segmented
              block
              value={option}
              onChange={setOption}
              style={{
                gap: 4,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              options={[
                {
                  label: <Typography>{t('overview')}</Typography>,
                  value: OPTIONS.OVERVIEW,
                },
                {
                  label: <Typography>{t('contents')}</Typography>,
                  value: OPTIONS.CONTENTS,
                },
                {
                  label: <Typography>{t('annotations')}</Typography>,
                  value: OPTIONS.ANNOTATIONS,
                },
              ]}
            />
          </div>
        </div>
        <div className='flex-1 overflow-y-auto'>
          <Switch>
            <Match when={option === OPTIONS.OVERVIEW}>
              <OverviewLayout
                book={book}
                isLoader={
                  loaderState[LOADER_STATE.IS_FETCHING_STRUCTURE]?.status === LOADER_STATUS.LOADING
                }
                hasLoadError={hasLoadError}
                onImgError={() => {
                  setHasLoadError(true)
                }}
              />
            </Match>
            <Match when={option === OPTIONS.CONTENTS}>
              <ContentsLayout
                onClick={onClick}
                toc={toc}
                activeToc={activeToc}
                isLoader={
                  loaderState[LOADER_STATE.IS_FETCHING_STRUCTURE]?.status === LOADER_STATUS.LOADING
                }
              />
            </Match>
            <Match when={option === OPTIONS.ANNOTATIONS}>
              <AnnotationsLayout
                isLoader={
                  loaderState[LOADER_STATE.IS_LOADING_ANNOTATIONS]?.status === LOADER_STATUS.LOADING
                }
                scopedLoader={scopedLoader}
                notes={notes}
                bookmarks={bookmarks}
                onClick={onClickBookmark}
                onClickNote={onClickNote}
                onClickDelete={onClickDelete}
                onClickEditNote={onClickEditNote}
                onClickDeleteNote={onClickDeleteNote}
                onClickEdit={onClickEdit}
              />
            </Match>
          </Switch>
        </div>
      </div>
    </Drawer>
  )
}

export default ReaderContentDrawer
