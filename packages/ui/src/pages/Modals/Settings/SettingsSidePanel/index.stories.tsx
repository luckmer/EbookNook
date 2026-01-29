import { Meta, StoryObj } from '@storybook/react-vite'
import SettingsSidePanel from '.'
import { OPTIONS } from '@interfaces/settings/enums'

const meta: Meta<typeof SettingsSidePanel> = {
  component: SettingsSidePanel,
  title: 'Pages/Settings/SettingsSidePanel',
}

export default meta
type Story = StoryObj<typeof SettingsSidePanel>

export const Default: Story = {
  render: () => {
    return <SettingsSidePanel option={OPTIONS.FONT} onClickOption={() => {}} />
  },
}
