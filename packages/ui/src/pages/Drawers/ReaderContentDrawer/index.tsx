import DefaultButton from '@components/Buttons/DefaultButton'
import Drawer from '@components/Drawer'
import Match from '@components/Match'
import Switch from '@components/Switch'
import { Typography } from '@components/Typography'
import { useWindowSize } from '@hooks/useWindowSize'
import { BOOK_STATUS } from '@interfaces/book/enums'
import { OPTIONS } from '@interfaces/contentDrawer/enums'
import { Segmented } from 'antd'
import { FC, useEffect, useMemo, useState } from 'react'
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
  status: BOOK_STATUS
}

export interface IProps {
  onClick: (href: string) => void
  onClickClose: () => void
  onClickBack: () => void
  isOpen: boolean
  toc: ITocItem[]
  isLoader: boolean
  activeToc: ITocItem
  book: IBook
}
const ReaderContentDrawer: FC<IProps> = ({
  isOpen,
  onClickClose,
  onClickBack,
  onClick,
  book,
  toc,
  isLoader,
  activeToc,
}) => {
  const [option, setOption] = useState<OPTIONS>(OPTIONS.OVERVIEW)
  const [hasLoadError, setHasLoadError] = useState(false)

  useEffect(() => {
    setHasLoadError(false)
  }, [book.cover])

  const { width } = useWindowSize()
  const isMobile = useMemo(() => width <= 700, [width])

  return (
    <Drawer
      onClickClose={onClickClose}
      isOpen={isOpen}
      placement={isMobile ? 'bottom' : 'left'}
      height={isMobile ? '80%' : '100%'}>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex flex-col gap-24 shrink-0 pb-12">
          <div>
            <DefaultButton
              onClick={onClickBack}
              className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
              <IoLibraryOutline className="w-24 h-24 transition-colors duration-200" />
            </DefaultButton>
          </div>
          <div className="pb-12 pr-24">
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
                  label: <Typography>Overview</Typography>,
                  value: OPTIONS.OVERVIEW,
                },
                {
                  label: <Typography>Contents</Typography>,
                  value: OPTIONS.CONTENTS,
                },
                {
                  label: <Typography>Bookmarks</Typography>,
                  value: OPTIONS.ANNOTATIONS,
                },
              ]}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Switch>
            <Match when={option === OPTIONS.OVERVIEW}>
              <OverviewLayout
                book={book}
                isLoader={isLoader}
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
                isLoader={isLoader}
              />
            </Match>
            <Match when={option === OPTIONS.ANNOTATIONS}>
              <AnnotationsLayout />
            </Match>
          </Switch>
        </div>
      </div>
    </Drawer>
  )
}

export default ReaderContentDrawer
