import { Meta, StoryObj } from '@storybook/react-vite'
import UploadButton from './index'

const meta: Meta<typeof UploadButton> = {
  component: UploadButton,
  title: 'Components/Buttons/UploadButton',
}

export default meta
type Story = StoryObj<typeof UploadButton>

export const BannersStory: Story = {
  render: () => {
    return <UploadButton label="Import books" onClick={() => {}} />
  },
}
