import { Meta, StoryObj } from '@storybook/react-vite'
import ModalRoot from './index'

const meta: Meta<typeof ModalRoot> = {
  component: ModalRoot,
  title: 'Components/Modals/ModalRoot',
}

export default meta
type Story = StoryObj<typeof ModalRoot>

export const BannersStory: Story = {
  render: () => {
    return (
      <ModalRoot isFooter centered isOpen={true} onClickClose={() => {}}>
        <div>Some contents...</div>
      </ModalRoot>
    )
  },
}
