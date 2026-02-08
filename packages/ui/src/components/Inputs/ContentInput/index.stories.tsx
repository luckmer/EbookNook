import { Meta, StoryObj } from '@storybook/react-vite'
import ContentInput from './index'
import { Typography } from 'antd'

const meta: Meta<typeof ContentInput> = {
  component: ContentInput,
  title: 'Components/Inputs/ContentInput',
}

export default meta
type Story = StoryObj<typeof ContentInput>

export const Default: Story = {
  render: (args) => {
    return (
      <ContentInput placeholder="Search" value="" onChange={() => {}} isEditing={args.isEditing}>
        <Typography>Content</Typography>
      </ContentInput>
    )
  },
}

Default.args = {
  isEditing: true,
}
