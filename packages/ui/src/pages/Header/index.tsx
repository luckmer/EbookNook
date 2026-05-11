import DefaultButton from '@components/Buttons/DefaultButton'
import DefaultInput from '@components/Inputs/DefaultInput'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import { NAVIGATION } from '@interfaces/routes/enums'
import clsx from 'clsx'
import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { BsLayoutSidebarInset } from 'react-icons/bs'
import { FaRegBookmark } from 'react-icons/fa6'
import { FcBookmark } from 'react-icons/fc'
import { GiHamburgerMenu } from 'react-icons/gi'

export interface IProps {
  onClickClose: () => void
  onClickMaximize: () => void
  onClickMinimize: () => void
  onClickSettings: () => void
  onClickOpenNotebook: () => void
  onClickOpenSidebar: () => void
  onChange: (value: string) => void
  onClickBookmark: () => void
  hideHeader: boolean
  location: string
  value: string
  isBookmarkActive: boolean
  bookName?: string
}

export const Header: FC<IProps> = ({
  onClickClose,
  onClickMaximize,
  onClickMinimize,
  onClickOpenSidebar,
  onClickOpenNotebook,
  onClickBookmark,
  onClickSettings,
  value,
  isBookmarkActive,
  location,
  hideHeader,
  bookName,
  onChange,
}) => {
  const { t } = useTranslation()
  const isReader = location.match(NAVIGATION.READER)

  return (
    <div
      data-tauri-drag-region
      className={clsx(
        hideHeader ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto',
        'relative flex flex-row items-center justify-between gap-48 p-12 rounded-8 transition-opacity duration-300 h-[70px]',
      )}>
      <Show when={isReader !== null}>
        <div className="flex flex-row gap-4">
          <DefaultButton
            onClick={onClickOpenSidebar}
            className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
            <BsLayoutSidebarInset className="w-18 h-18 transition-colors duration-200" />
          </DefaultButton>
          <DefaultButton
            onClick={onClickBookmark}
            className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
            <Show
              when={isBookmarkActive}
              fallback={<FaRegBookmark className="w-18 h-18 transition-colors duration-200" />}>
              <FcBookmark className="w-18 h-18 transition-colors duration-200" />
            </Show>
          </DefaultButton>
        </div>
      </Show>
      <Show when={!!bookName}>
        <div
          className="w-full flex items-center justify-center overflow-hidden max-[470px]:hidden pointer-events-none"
          data-tauri-drag-region>
          <Typography text="caption" color="white" ellipsis>
            {bookName}
          </Typography>
        </div>
      </Show>
      <Show when={!isReader}>
        <div className="w-full h-full">
          <DefaultInput
            data-tauri-drag-region="false"
            placeholder={t('search')}
            value={value}
            onChange={onChange}
            className="bg-surface-200/30 h-full rounded-6 px-12 font-ubuntu"
            id="search_input"
          />
        </div>
      </Show>
      <div className="flex flex-row gap-4 ml-auto" data-tauri-drag-region>
        <DefaultButton
          onClick={onClickSettings}
          className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
          <GiHamburgerMenu className="w-18 h-18 transition-colors duration-200" />
        </DefaultButton>

        <DefaultButton
          onClick={onClickMinimize}
          className="transition-colors hover:bg-button-primary-hover hover:text-text-primary duration-300 text-text-secondary rounded-4 px-6 py-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13H5v-2h14z" />
          </svg>
        </DefaultButton>

        <DefaultButton
          onClick={onClickMaximize}
          className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M4 4h16v16H4zm2 4v10h12V8z" />
          </svg>
        </DefaultButton>

        <DefaultButton
          onClick={onClickClose}
          className="hover:bg-accent-red hover:text-text-primary text-text-secondary transition-colors duration-300 rounded-4 px-6 py-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M13.46 12L19 17.54V19h-1.46L12 13.46L6.46 19H5v-1.46L10.54 12L5 6.46V5h1.46L12 10.54L17.54 5H19v1.46z"
            />
          </svg>
        </DefaultButton>
      </div>
    </div>
  )
}

export default memo(Header)
