import { Meta, StoryObj } from '@storybook/react-vite'
import FontSettings from '.'

const meta: Meta<typeof FontSettings> = {
  component: FontSettings,
  title: 'Pages/Settings/FontSettings',
}

export default meta
type Story = StoryObj<typeof FontSettings>

export const Default: Story = {
  render: () => {
    return (
      <FontSettings
        onClick={() => {}}
        fontWeight={400}
        defaultFontSize={16}
        onClickRestart={() => {}}>
        <div>children</div>
      </FontSettings>
    )
  },
}
