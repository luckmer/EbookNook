import { Meta, StoryObj } from '@storybook/react-vite'
import BookShelf from '.'

const meta: Meta<typeof BookShelf> = {
  component: BookShelf,
  title: 'Pages/BookShelf',
}

export default meta
type Story = StoryObj<typeof BookShelf>

export const Default: Story = {
  render: () => {
    return (
      <BookShelf
        onClickBook={() => {}}
        onClickImportBook={() => {}}
        books={[]}
        onClickDetails={() => {}}
      />
    )
  },
}
