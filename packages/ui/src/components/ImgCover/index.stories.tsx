import { Meta, StoryObj } from '@storybook/react-vite'
import ImgCover from './index'

const meta: Meta<typeof ImgCover> = {
  component: ImgCover,
  title: 'Components/ImgCover',
}

export default meta
type Story = StoryObj<typeof ImgCover>

export const BannersStory: Story = {
  render: () => {
    return <ImgCover name="Cover" author="Author" />
  },
}
