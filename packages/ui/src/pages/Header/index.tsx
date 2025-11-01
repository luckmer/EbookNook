import DefaultButton from '@components/Buttons/DefaultButton'
import DefaultInput from '@components/Inputs/DefaultInput'
import { FC, memo } from 'react'

export interface IProps {
  onClickClose: () => void
  onClickMaximize: () => void
  onClickMinimize: () => void
  value: string
  onChange: (value: string) => void
}

const Header: FC<IProps> = ({
  onClickClose,
  onClickMaximize,
  onClickMinimize,
  value,
  onChange,
}) => {
  return (
    <div
      data-tauri-drag-region
      className="relative items-center flex flex-row p-12 rounded-8 justify-between gap-48">
      <div className="w-full h-full max-w-[900px] mx-auto">
        <DefaultInput
          placeholder="Search"
          value={value}
          onChange={onChange}
          className="bg-black-800 h-full rounded-6 p-12 text-white-100 border-black-800 focus:border-black-300 border hover:border-black-300 font-ubuntu"
          id="search_input"
        />
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex items-center ">
          <DefaultButton
            onClick={onClickMinimize}
            className="transition-colors hover:bg-black-300 hover:text-white-100 duration-300  text-white-200 rounded-4 px-6 py-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 13H5v-2h14z" />
            </svg>
          </DefaultButton>
        </div>
        <div className="flex items-center ">
          <DefaultButton
            onClick={onClickMaximize}
            className="transition-colors hover:bg-black-300 hover:text-white-100 text-white-200 duration-300 rounded-4 px-6 py-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M4 4h16v16H4zm2 4v10h12V8z" />
            </svg>
          </DefaultButton>
        </div>
        <div className="flex items-center">
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
    </div>
  )
}

export default memo(Header)
