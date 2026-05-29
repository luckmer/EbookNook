import { BOOK_STATUS } from '@interfaces/book/enums'
import type { Meta, StoryObj } from '@storybook/react-vite'
import OverviewLayout from '.'

const meta: Meta<typeof OverviewLayout> = {
  component: OverviewLayout,
  title: 'Pages/Drawers/ReaderContentDrawer/OverviewLayout',
}

export default meta
type Story = StoryObj<typeof OverviewLayout>

export const Default: Story = {
  render: (args) => {
    return <OverviewLayout {...args} />
  },
}

Default.args = {
  book: {
    status: BOOK_STATUS.ERROR,
    author: 'author',
    title: 'title',
    published: 'published',
    publisher: 'publisher',
    cover: 'cover',
    description: 'Lorem ipsum',
  },
  isLoader: false,
  hasLoadError: false,
  onImgError: () => {},
}
