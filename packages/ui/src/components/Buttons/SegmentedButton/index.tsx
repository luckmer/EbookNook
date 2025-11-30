import { Segmented } from 'antd'

export interface IProps<T> {
  options: T[]
  onClickOption?: (value: T) => void
  value: T
}

const SegmentedButton = <T,>({ options, onClickOption, value }: IProps<T>) => {
  return (
    <Segmented<T>
      options={options}
      value={value}
      onChange={(value) => {
        onClickOption?.(value)
      }}
    />
  )
}

export default SegmentedButton
