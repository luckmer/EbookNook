import type { Meta, StoryObj } from '@storybook/react-vite'
import Bookmark from './index'

const meta: Meta<typeof Bookmark> = {
  component: Bookmark,
  title: 'Components/Bookmark',
}

export default meta
type Story = StoryObj<typeof Bookmark>

export const Default: Story = {
  render: (args) => {
    return <Bookmark {...args} onClick={() => {}} />
  },
}

Default.args = {
  title: 'Chapter 1',
  chapter: 'Chapter 1',
  createdAt: Date.now().toString(),
  onClick: () => {},
}
