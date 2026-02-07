import { Meta, StoryObj } from '@storybook/react-vite'
import Book from './index'

const meta: Meta<typeof Book> = {
  component: Book,
  title: 'Components/Book',
}

export default meta
type Story = StoryObj<typeof Book>

export const BannersStory: Story = {
  render: () => {
    return (
      <Book img="" title="test" onClick={() => {}} onClickDetails={() => {}} progress="20.20" />
    )
  },
}
