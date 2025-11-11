import { Meta, StoryObj } from '@storybook/react-vite'
import { Typography } from './index'

const meta: Meta<typeof Typography> = {
  component: Typography,
  title: 'Components/Typography',
}

export default meta
type Story = StoryObj<typeof Typography>

export const BannersStory: Story = {
  render: () => {
    return (
      <div className="bg-red-100 p-16">
        <Typography>Typography example</Typography>
      </div>
    )
  },
}
