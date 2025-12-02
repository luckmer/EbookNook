import { Meta, StoryObj } from '@storybook/react-vite'
import Spin from './index'

const meta: Meta<typeof Spin> = {
  component: Spin,
  title: 'Components/Spin',
}

export default meta
type Story = StoryObj<typeof Spin>

export const BannersStory: Story = {
  render: () => {
    return <Spin />
  },
}
