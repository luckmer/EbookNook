import type { Meta, StoryObj } from '@storybook/react-vite'
import AnnotationsLayout, { type IProps } from '.'

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

const args: IProps = {
  scopedLoader: {},
  isLoader: false,
  onClickDeleteNote: () => {},
  onClickEditNote: () => {},
  onClickNote: () => {},
  notes: [
    {
      value: 'value',
      bookId: 'bookId',
      note: 'note',
      color: 'color',
      page: 'page',
      noteId: 'noteId',
      chapter: 'chapter',
      title: 'title',
      text: 'text',
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    },
    {
      value: 'value',
      bookId: 'bookId',
      note: 'note',
      color: 'color',
      page: 'page',
      noteId: 'noteId',
      chapter: 'chapter',
      title: 'title',
      text: 'text',
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    },
    {
      value: 'value',
      bookId: 'bookId',
      note: 'note',
      color: 'color',
      page: 'page',
      noteId: 'noteId',
      chapter: 'chapter',
      title: 'title',
      text: 'text',
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    },
  ],
  onClickDelete: () => {},
  onClickEdit: () => {},
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

Default.args = args
