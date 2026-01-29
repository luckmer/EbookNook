import { Meta, StoryObj } from '@storybook/react-vite'
import ModalHeader from './index'

const meta: Meta<typeof ModalHeader> = {
  component: ModalHeader,
  title: 'Components/Modals/ModalHeader',
}

export default meta
type Story = StoryObj<typeof ModalHeader>

export const BannersStory: Story = {
  render: () => {
    return <ModalHeader onClickClose={() => {}} label="ModalHeader" />
  },
}
