import { IBindingsBookmark } from '@bindings/bookmarks'
import { BOOK_STATUS } from '@interfaces/book/enums'
import { Meta, StoryObj } from '@storybook/react-vite'
import ReaderContentDrawer from '.'

const meta: Meta<typeof ReaderContentDrawer> = {
  component: ReaderContentDrawer,
  title: 'Pages/Drawers/ReaderContentDrawer',
}

export default meta
type Story = StoryObj<typeof ReaderContentDrawer>

const bookmarks: IBindingsBookmark[] = [
  {
    bookId: 'bookId',
    cfi: 'cfi',
    chapter: 'chapter',
    title: 'title',
    format: 'EPUB',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
  },
  {
    bookId: 'bookId',
    cfi: 'cfi',
    chapter: 'chapter',
    title: 'title',
    format: 'EPUB',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
  },
  {
    bookId: 'bookId',
    cfi: 'cfi',
    chapter: 'chapter',
    title: 'title',
    format: 'EPUB',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
  },
]

const toc = [
  {
    href: 'epub30-overview.xhtml#sec-intro',
    label: '1. Introduction',
    subitems: new Array(6).fill(0).map(() => ({
      href: 'epub30-overview.xhtml#sec-intro',
      id: 'epub30-overview.xhtml#sec-intro',
      label: '1. Introduction',
      parent: 'ovw',
      subitems: [],
    })),
  },
  {
    href: 'epub30-overview.xhtml#sec-intro',
    label: '1. Introduction',
    subitems: new Array(6).fill(0).map(() => ({
      href: 'epub30-overview.xhtml#sec-intro',
      id: 'epub30-overview.xhtml#sec-intro',
      label: '1. Introduction',
      parent: 'ovw',
      subitems: [],
    })),
  },
  {
    href: 'epub30-overview.xhtml#sec-intro',
    label: '1. Introduction',
    subitems: new Array(6).fill(0).map(() => ({
      href: 'epub30-overview.xhtml#sec-intro',
      id: 'epub30-overview.xhtml#sec-intro',
      label: '1. Introduction',
      parent: 'ovw',
      subitems: [],
    })),
  },
]

export const Default: Story = {
  render: (args) => {
    return <ReaderContentDrawer {...args} />
  },
}

Default.args = {
  isLoader: false,
  isOpen: true,
  bookmarks,
  activeToc: {
    href: 'epub30-overview.xhtml#sec-intro',
    label: '1. Introduction',
    subitems: [],
  },
  toc,
  book: {
    status: BOOK_STATUS.ERROR,
    author: 'author',
    title: 'title',
    published: 'published',
    publisher: 'publisher',
    cover: 'cover',
    description: 'Lorem ipsum',
  },

  onClickBookmark: () => {},
  onClickBack: () => {},
  onClick: () => {},
  onClickClose: () => {},
}
