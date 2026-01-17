import { Meta, StoryObj } from '@storybook/react-vite'
import BookOverviewModal from '.'

const meta: Meta<typeof BookOverviewModal> = {
  component: BookOverviewModal,
  title: 'Pages/BookOverviewModal',
}

export default meta
type Story = StoryObj<typeof BookOverviewModal>

export const Default: Story = {
  render: () => {
    return (
      <BookOverviewModal
        book={{
          bookDescription: 'description',
          cover: 'cover',
          author: 'author',
          title: 'title',
          published: 'published',
          publisher: 'publisher',
        }}
        onClickClose={() => {}}
        isOpen={true}
      />
    )
  },
}
