import { Meta, StoryObj } from '@storybook/react-vite'
import Show from './index'
import { Typography } from '@components/Typography'

const meta: Meta<typeof Show> = {
  component: Show,
  title: 'Components/Show',
}

export default meta
type Story = StoryObj<typeof Show>

export const BannersStory: Story = {
  render: () => {
    return (
      <div className="bg-red-100 p-16">
        <Show when={true}>
          <Typography>Typography example </Typography>
        </Show>
      </div>
    )
  },
}
