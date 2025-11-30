import { Meta, StoryObj } from '@storybook/react-vite'
import Match from './index'

const meta: Meta<typeof Match> = {
  component: Match,
  title: 'Components/Match',
}

export default meta
type Story = StoryObj<typeof Match>

export const BannersStory: Story = {
  render: () => {
    return (
      <Match when={true}>
        <div>Some contents...</div>
      </Match>
    )
  },
}
