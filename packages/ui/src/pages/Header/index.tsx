import DefaultButton from '@components/Buttons/DefaultButton'
import DefaultInput from '@components/Inputs/DefaultInput'
import Show from '@components/Show'
import { NAVIGATION } from '@interfaces/routes/enums'
import { FC, memo } from 'react'
import { BsLayoutSidebarInset } from 'react-icons/bs'
import { GiHamburgerMenu } from 'react-icons/gi'
import { CgMenuRound } from 'react-icons/cg'
import clsx from 'clsx'

export interface IProps {
  onClickClose: () => void
  onClickMaximize: () => void
  onClickMinimize: () => void
  onClickSettings: () => void
  onClickOpenSidebar: () => void
  onChange: (value: string) => void
  hideHeader: boolean
  location: string
  value: string
}

export const Header: FC<IProps> = ({
  onClickClose,
  onClickMaximize,
  onClickMinimize,
  onClickOpenSidebar,
  onClickSettings,
  value,
  location,
  hideHeader,
  onChange,
}) => {
  const isReader = location.match(NAVIGATION.READER)

  return (
    <div
      data-tauri-drag-region
      className={clsx(
        hideHeader ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto',
        'relative flex flex-row items-center justify-between gap-48 p-12 rounded-8 transition-opacity duration-300 h-[70px]'
      )}>
      <Show when={isReader !== null}>
        <DefaultButton
          onClick={onClickOpenSidebar}
          className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
          <BsLayoutSidebarInset className="w-18 h-18 transition-colors duration-200" />
        </DefaultButton>
      </Show>
      <Show when={!isReader}>
        <div className="w-full h-full">
          <DefaultInput
            data-tauri-drag-region="false"
            placeholder="Search"
            value={value}
            onChange={onChange}
            className="bg-surface-200/30 h-full rounded-6 px-12 font-ubuntu"
            id="search_input"
          />
        </div>
      </Show>
      <div className="flex flex-row gap-4 ml-auto" data-tauri-drag-region="false">
        <DefaultButton
          disabled
          onClick={() => {}}
          className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
          <CgMenuRound className="w-18 h-18 transition-colors duration-200" />
        </DefaultButton>

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
