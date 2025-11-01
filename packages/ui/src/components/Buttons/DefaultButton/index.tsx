import clsx from 'clsx'

export interface IProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
}

const DefaultButton: React.FC<IProps> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      className={clsx('cursor-pointer', className)}>
      {children}
    </button>
  )
}

export default DefaultButton
