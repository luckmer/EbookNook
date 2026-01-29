import { Meta, StoryObj } from '@storybook/react-vite'
import Settings from '.'

const meta: Meta<typeof Settings> = {
  component: Settings,
  title: 'Pages/Settings',
}

export default meta
type Story = StoryObj<typeof Settings>

export const Default: Story = {
  render: () => {
    return (
      <Settings
        isOpen
        onClick={() => {}}
        onClickClose={() => {}}
        settings={{
          paragraphMargin: 0,
          defaultFontSize: 0,
          fontWeight: 0,
          wordSpacing: 0,
          letterSpacing: 0,
          textIndent: 0,
          lineHeight: 0,
        }}
      />
    )
  },
}
