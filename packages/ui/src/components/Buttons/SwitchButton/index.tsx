import clsx from 'clsx'
import { FC } from 'react'

export interface IProps {
  onClick: () => void
  active: boolean
}

const SwitchButton: FC<IProps> = ({ onClick, active }) => {
  return (
    <label className="inline-flex items-center cursor-pointer group">
      <input
        type="checkbox"
        className={clsx('sr-only', active && 'peer')}
        checked={active}
        onChange={onClick}
      />
      <div
        className="relative w-[40px] h-[20px] rounded-full transition-colors
                    bg-surface-200
                    peer-checked:bg-accent-blue
                    peer-checked:after:bg-text-primary
                    after:bg-text-primary
                    after:content-[''] after:absolute after:top-[3px] after:left-[3px] 
                    after:rounded-full after:h-[14px] after:w-[14px] 
                    after:transition-all 
                    peer-checked:after:translate-x-[20px]"
      />
    </label>
  )
}

export default SwitchButton
