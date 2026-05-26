import { OPTIONS } from '@interfaces/settings/enums'
import { Meta, StoryObj } from '@storybook/react-vite'
import SettingsSidePanel from '.'

const meta: Meta<typeof SettingsSidePanel> = {
  component: SettingsSidePanel,
  title: 'Pages/Modals/Settings/SettingsSidePanel',
}

export default meta
type Story = StoryObj<typeof SettingsSidePanel>

export const Default: Story = {
  render: () => {
    return <SettingsSidePanel option={OPTIONS.FONT} onClickOption={() => {}} />
  },
}
