import DefaultButton from '@components/Buttons/DefaultButton'
import Show from '@components/Show'
import { Typography } from '@components/Typography'
import clsx from 'clsx'
import { FC } from 'react'
import { IoMdClose } from 'react-icons/io'
import { IoIosArrowBack } from 'react-icons/io'

export interface IProps {
  onClickOpen?: () => void
  onClickClose: () => void
  open?: boolean
  label: string
}

const ModalHeader: FC<IProps> = ({ label, onClickClose, onClickOpen, open }) => {
  return (
    <div className="flex flex-row gap-12 items-center justify-between border-b border-border-modal p-16">
      <div className="flex flex-row gap-12 items-center">
        <Show when={typeof onClickOpen !== 'undefined'}>
          <DefaultButton
            onClick={() => {
              onClickOpen?.()
            }}
            className="  p-4 rounded-4  hover:bg-surface-100 duration-200 ">
            <IoIosArrowBack
              className={clsx(
                'w-[18px] h-[18px] transition-all duration-200',
                open ? 'rotate-y-180' : 'rotate-y-0',
              )}
            />
          </DefaultButton>
        </Show>
        <Typography text="body">{label}</Typography>
      </div>
      <DefaultButton
        onClick={onClickClose}
        className="  p-4 rounded-4  hover:bg-surface-100 duration-200 ">
        <IoMdClose className="w-[18px] h-[18px]" />
      </DefaultButton>
    </div>
  )
}

export default ModalHeader
