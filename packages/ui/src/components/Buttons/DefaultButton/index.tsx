import clsx from 'clsx'

export interface IProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

const DefaultButton: React.FC<IProps> = ({ children, onClick, className, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      className={clsx('cursor-pointer', className, disabled && 'pointer-events-none opacity-50')}>
      {children}
    </button>
  )
}

export default DefaultButton
