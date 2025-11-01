import { Meta, StoryObj } from '@storybook/react-vite'
import EmptyLibrary from './index'

const meta: Meta<typeof EmptyLibrary> = {
  component: EmptyLibrary,
  title: 'Pages/EmptyLibrary',
}

export default meta
type Story = StoryObj<typeof EmptyLibrary>

export const BannersStory: Story = {
  render: () => {
    return <EmptyLibrary onClick={() => {}} />
  },
}
