import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography } from 'antd'
import DateContentInput from './index'

const meta: Meta<typeof DateContentInput> = {
  component: DateContentInput,
  title: 'Components/Inputs/DateContentInput',
}

export default meta
type Story = StoryObj<typeof DateContentInput>

export const Default: Story = {
  render: (args) => {
    return (
      <DateContentInput
        placeholder={args.placeholder}
        value={args.value}
        onChange={() => {}}
        isEditing={args.isEditing}>
        <Typography>Content</Typography>
      </DateContentInput>
    )
  },
}

Default.args = {
  value: '2023-01-01',
  placeholder: 'Date',
  isEditing: true,
}
