import { Meta, StoryObj } from '@storybook/react-vite'
import EmptyBookShelf from './index'

const meta: Meta<typeof EmptyBookShelf> = {
  component: EmptyBookShelf,
  title: 'Components/EmptyBookShelf',
}

export default meta
type Story = StoryObj<typeof EmptyBookShelf>

export const BannersStory: Story = {
  render: () => {
    return <EmptyBookShelf onClick={() => {}} />
  },
}
