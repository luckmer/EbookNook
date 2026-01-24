import DefaultButton from '@components/Buttons/DefaultButton'
import { Typography } from '@components/Typography'
import { FC } from 'react'
import { IoMdClose } from 'react-icons/io'

export interface IProps {
  onClickClose: () => void
  label: string
}

const ModalHeader: FC<IProps> = ({ label, onClickClose }) => {
  return (
    <div className="flex flex-row gap-12 items-center justify-between border-b border-border-modal p-16">
      <Typography text="body">{label}</Typography>
      <DefaultButton
        onClick={onClickClose}
        className="  p-4 rounded-4  hover:bg-surface-100 duration-200 ">
        <IoMdClose className="w-[18px] h-[18px]" />
      </DefaultButton>
    </div>
  )
}

export default ModalHeader
