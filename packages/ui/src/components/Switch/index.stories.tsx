import { Meta, StoryObj } from '@storybook/react-vite'
import Switch from './index'

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: 'Components/Switch',
}

export default meta
type Story = StoryObj<typeof Switch>

export const BannersStory: Story = {
  render: () => {
    return (
      <Switch>
        <div>Some contents...</div>
      </Switch>
    )
  },
}
