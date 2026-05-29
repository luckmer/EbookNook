import type { Meta, StoryObj } from '@storybook/react-vite'
import AnnotationsLayout from '.'

const meta: Meta<typeof AnnotationsLayout> = {
  component: AnnotationsLayout,
  title: 'Pages/Drawers/ReaderContentDrawer/AnnotationsLayout',
}

export default meta
type Story = StoryObj<typeof AnnotationsLayout>

export const Default: Story = {
  render: (args) => {
    return <AnnotationsLayout {...args} />
  },
}

Default.args = {
  bookmarks: [
    {
      bookId: 'bookId',
      cfi: 'cfi',
      chapter: 'chapter',
      title: 'title',
      format: 'EPUB',
      updatedAt: Date.now().toString(),
      createdAt: Date.now().toString(),
    },
    {
      bookId: 'bookId',
      cfi: 'cfi',
      chapter: 'chapter',
      title: 'title',
      format: 'EPUB',
      updatedAt: Date.now().toString(),
      createdAt: Date.now().toString(),
    },
  ],
  onClick: () => {},
}
