import { Typography } from '@components/Typography'
import { InputNumber, Slider } from 'antd'
import { FC } from 'react'

export interface IProps {
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  value: number
}

const RangeInput: FC<IProps> = ({ min, max, value, step, onChange }) => {
  return (
    <div className="flex flex-row gap-12 items-center w-full">
      <div className="flex flex-row gap-12 w-full items-center">
        <Typography color="muted" text="small">
          {min}
        </Typography>
        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full"
        />
        <Typography color="muted" text="small">
          {max}
        </Typography>
      </div>
      <InputNumber
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(value) => {
          if (value) {
            onChange(value)
          }
        }}
      />
    </div>
  )
}

export default RangeInput
