import DefaultButton from '@components/Buttons/DefaultButton'
import DefaultInput from '@components/Inputs/DefaultInput'
import Show from '@components/Show'
import { NAVIGATION } from '@interfaces/routes/enums'
import { FC, memo } from 'react'
import { BsLayoutSidebarInset } from 'react-icons/bs'
import { CiSettings } from 'react-icons/ci'

export interface IProps {
  onClickClose: () => void
  onClickMaximize: () => void
  onClickMinimize: () => void
  onClickSettings: () => void
  onClickOpenSidebar: () => void
  onChange: (value: string) => void
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
  onChange,
}) => {
  const isReader = location.match(NAVIGATION.READER)

  return (
    <div
      data-tauri-drag-region
      className="relative flex flex-row items-center justify-between gap-48 p-12 rounded-8 transition-opacity duration-300 h-[70px]">
      <Show when={isReader !== null}>
        <DefaultButton
          onClick={onClickOpenSidebar}
          className="transition-colors hover:bg-black-300 hover:text-white-100 text-white-200 duration-300 rounded-4 px-6 py-6">
          <BsLayoutSidebarInset className="fill-white-100 w-18 h-18 group-hover:fill-hover-grey-blue-200 transition-colors duration-200" />
        </DefaultButton>
      </Show>
      <Show when={!isReader}>
        <div className="w-full h-full">
          <DefaultInput
            data-tauri-drag-region="false"
            placeholder="Search"
            value={value}
            onChange={onChange}
            className="bg-black-800 h-full rounded-6 px-12  text-white-100 border-black-800 focus:border-black-300 border hover:border-black-300 font-ubuntu"
            id="search_input"
          />
        </div>
      </Show>
      <div className="flex flex-row gap-4 ml-auto" data-tauri-drag-region="false">
        <DefaultButton
          onClick={onClickSettings}
          className="transition-colors hover:bg-black-300 hover:text-white-100 text-white-200 duration-300 rounded-4 px-6 py-6">
          <CiSettings className=" fill-white-100 w-18 h-18 group-hover:fill-hover-grey-blue-200 transition-colors duration-200" />
        </DefaultButton>
        <DefaultButton
          onClick={onClickMinimize}
          className="transition-colors hover:bg-black-300 hover:text-white-100 duration-300 text-white-200 rounded-4 px-6 py-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13H5v-2h14z" />
          </svg>
        </DefaultButton>

        <DefaultButton
          onClick={onClickMaximize}
          className="transition-colors hover:bg-black-300 hover:text-white-100 text-white-200 duration-300 rounded-4 px-6 py-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M4 4h16v16H4zm2 4v10h12V8z" />
          </svg>
        </DefaultButton>

        <DefaultButton
          onClick={onClickClose}
          className="hover:bg-red-200 hover:text-white-100 text-white-200 transition-colors duration-300 rounded-4 px-6 py-6">
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
