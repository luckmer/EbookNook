import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import SegmentedButton from './index'

const meta: Meta<typeof SegmentedButton> = {
  component: SegmentedButton,
  title: 'Components/Buttons/SegmentedButton',
}

export default meta
type Story = StoryObj<typeof SegmentedButton>

enum Options {
  FONT = 'font',
  LAYOUT = 'layout',
}

export const BannersStory: Story = {
  render: () => {
    const [option, SetOption] = useState<Options>(Options.FONT)
    return (
      <SegmentedButton<Options>
        value={option}
        options={Object.values(Options)}
        onClickOption={(value) => {
          SetOption(value)
        }}
      />
    )
  },
}
