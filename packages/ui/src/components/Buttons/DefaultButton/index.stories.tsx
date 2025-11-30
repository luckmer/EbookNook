import { Typography } from '@components/Typography'
import { Meta, StoryObj } from '@storybook/react-vite'
import DefaultButton from './index'

const meta: Meta<typeof DefaultButton> = {
  component: DefaultButton,
  title: 'Components/Buttons/DefaultButton',
}

export default meta
type Story = StoryObj<typeof DefaultButton>

export const BannersStory: Story = {
  render: () => {
    return (
      <DefaultButton onClick={() => {}}>
        <Typography text="caption" color="white">
          Default button
        </Typography>
      </DefaultButton>
    )
  },
}
