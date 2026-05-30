import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography } from 'antd'
import ContentArea from './index'

const meta: Meta<typeof ContentArea> = {
  component: ContentArea,
  title: 'Components/Inputs/ContentArea',
}

export default meta
type Story = StoryObj<typeof ContentArea>

export const Default: Story = {
  render: (args) => {
    return (
      <ContentArea placeholder='Search' value='' onChange={() => {}} isEditing={args.isEditing}>
        <Typography>Content</Typography>
      </ContentArea>
    )
  },
}

Default.args = {
  isEditing: true,
}
