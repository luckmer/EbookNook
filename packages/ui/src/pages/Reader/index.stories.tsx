import { Meta, StoryObj } from '@storybook/react-vite'
import Reader from './index'

const meta: Meta<typeof Reader> = {
  component: Reader,
  title: 'Pages/Reader',
}

export default meta
type Story = StoryObj<typeof Reader>

export const BannersStory: Story = {
  render: () => {
    return <Reader epubCodeSearch="" selectedChapter="" />
  },
}
