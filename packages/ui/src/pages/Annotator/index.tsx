import DefaultButton from '@components/Buttons/DefaultButton'
import { FC } from 'react'
import { FiCopy } from 'react-icons/fi'

export interface IModalPosition {
  top: string
  left: string
  width: string
  minHeight: string
}

export interface IProps {
  modalPosition: Record<string, string>
  pointPosition: Record<string, string | number>
  onClickCopy: () => void
  // onClickCustomCopy: () => void
}

const Annotator: FC<IProps> = ({
  modalPosition,
  pointPosition,
  onClickCopy,
  // onClickCustomCopy,
}) => {
  return (
    <div
      className="annotator-popup fixed z-50 bg-surface-100 shadow-lg rounded-lg flex items-center justify-center rounded-6"
      style={modalPosition}
      onClick={(e) => e.stopPropagation()}>
      <div className="absolute " style={pointPosition} />
      <div className="flex gap-12 items-center justify-center h-full p-3">
        <DefaultButton
          onClick={onClickCopy}
          className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
          <FiCopy className="w-18 h-18 transition-colors duration-200" />
        </DefaultButton>
        {/* <DefaultButton
          onClick={onClickCustomCopy}
          className="transition-colors hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-4 px-6 py-6">
          <FiEdit className="w-18 h-18 transition-colors duration-200" />
        </DefaultButton> */}
      </div>
    </div>
  )
}

export default Annotator
