import { Meta, StoryObj } from '@storybook/react-vite'
import TypographyPreview from './index'

const meta: Meta<typeof TypographyPreview> = {
  component: TypographyPreview,
  title: 'Components/TypographyPreview',
}

export default meta
type Story = StoryObj<typeof TypographyPreview>

export const BannersStory: Story = {
  render: () => {
    return <TypographyPreview styles={{ fontSize: '12px' }} />
  },
}
