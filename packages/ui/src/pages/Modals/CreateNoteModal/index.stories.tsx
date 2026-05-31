import type { Meta, StoryObj } from '@storybook/react-vite'
import CreateNoteModal, { type IProps } from './index'

const meta: Meta<typeof CreateNoteModal> = {
  component: CreateNoteModal,
  title: 'Pages/Modals/CreateNoteModal',
}

export default meta
type Story = StoryObj<typeof CreateNoteModal>

export const Default: Story = {
  render: (args) => {
    return <CreateNoteModal {...args} />
  },
}

const args: IProps = {
  isOpen: true,
  book: 'Annotations',
  createdAt: Date.now().toString(),
  onClickClose: () => {},
  onClickSaveNote: () => {},
  selectedText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, quod.',
}

Default.args = args
