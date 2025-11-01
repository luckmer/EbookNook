import { Meta, StoryObj } from '@storybook/react-vite'
import DefaultInput from './index'

const meta: Meta<typeof DefaultInput> = {
  component: DefaultInput,
  title: 'Components/Inputs/DefaultInput',
}

export default meta
type Story = StoryObj<typeof DefaultInput>

export const BannersStory: Story = {
  render: () => {
    return <DefaultInput placeholder="Search" value="" onChange={() => {}} />
  },
}
