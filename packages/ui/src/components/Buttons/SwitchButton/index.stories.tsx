import { Meta, StoryObj } from '@storybook/react-vite'
import SwitchButton from './index'

const meta: Meta<typeof SwitchButton> = {
  title: 'Components/Buttons/SwitchButton',
  component: SwitchButton,
  argTypes: {
    active: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof SwitchButton>

export const Default: Story = {
  args: {
    active: false,
    onClick: () => {},
  },
}
