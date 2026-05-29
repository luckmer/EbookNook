import type { Meta, StoryObj } from '@storybook/react-vite'
import CreateBookmarkModal from './index'

const meta: Meta<typeof CreateBookmarkModal> = {
  component: CreateBookmarkModal,
  title: 'Pages/Modals/CreateBookmarkModal',
}

export default meta
type Story = StoryObj<typeof CreateBookmarkModal>

export const Default: Story = {
  render: (args) => {
    return (
      <CreateBookmarkModal
        onClickClose={() => {}}
        onClickCreateBookmark={() => {}}
        isOpen={args.isOpen}
      />
    )
  },
}

Default.args = {
  isOpen: true,
}
