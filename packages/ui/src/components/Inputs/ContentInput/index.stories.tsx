import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography } from 'antd'
import ContentInput from './index'

const meta: Meta<typeof ContentInput> = {
  component: ContentInput,
  title: 'Components/Inputs/ContentInput',
}

export default meta
type Story = StoryObj<typeof ContentInput>

export const Default: Story = {
  render: (args) => {
    return (
      <ContentInput placeholder='Search' value='' onChange={() => {}} isEditing={args.isEditing}>
        <Typography>Content</Typography>
      </ContentInput>
    )
  },
}

Default.args = {
  isEditing: true,
}
