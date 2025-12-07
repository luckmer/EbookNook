import { Meta, StoryObj } from '@storybook/react-vite'
import EmptyResult from './index'

const meta: Meta<typeof EmptyResult> = {
  component: EmptyResult,
  title: 'Components/EmptyResult',
}

export default meta
type Story = StoryObj<typeof EmptyResult>

export const BannersStory: Story = {
  render: () => {
    return <EmptyResult />
  },
}
