import { Meta, StoryObj } from '@storybook/react-vite'
import DrawerRoot from './index'

const meta: Meta<typeof DrawerRoot> = {
  component: DrawerRoot,
  title: 'Components/DrawerRoot',
}

export default meta
type Story = StoryObj<typeof DrawerRoot>

export const BannersStory: Story = {
  render: () => {
    return (
      <DrawerRoot placement="right" isOpen={true} onClickClose={() => {}}>
        <div>Some contents...</div>
      </DrawerRoot>
    )
  },
}
