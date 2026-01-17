import { Meta, StoryObj } from '@storybook/react-vite'
import LayoutSettings from '.'

const meta: Meta<typeof LayoutSettings> = {
  component: LayoutSettings,
  title: 'Pages/Settings/LayoutSettings',
}

export default meta
type Story = StoryObj<typeof LayoutSettings>

export const Default: Story = {
  render: () => {
    return (
      <LayoutSettings
        onClick={() => {}}
        wordSpacing={0}
        letterSpacing={0}
        textIndent={0}
        lineHeight={0}
      />
    )
  },
}
