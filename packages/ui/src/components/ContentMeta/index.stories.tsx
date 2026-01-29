import { Meta, StoryObj } from '@storybook/react-vite'
import ContentMeta from './index'

const meta: Meta<typeof ContentMeta> = {
  component: ContentMeta,
  title: 'Components/ContentMeta',
}

export default meta
type Story = StoryObj<typeof ContentMeta>

export const BannersStory: Story = {
  render: () => {
    return <ContentMeta description="description" label="ModalHeader" />
  },
}
