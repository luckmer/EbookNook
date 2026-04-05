import { LANGUAGE } from '@interfaces/language/enums'
import { Meta, StoryObj } from '@storybook/react-vite'
import LanguageSettings, { IProps } from '.'

const meta: Meta<typeof LanguageSettings> = {
  component: LanguageSettings,
  title: 'Pages/Settings/LanguageSettings',
}

export default meta
type Story = StoryObj<typeof LanguageSettings>

export const Default: Story = {
  render: (args: IProps) => {
    return <LanguageSettings {...args} />
  },
}

Default.args = {
  onClickLanguage: () => {},
  selectedLanguage: LANGUAGE.POLISH,
}
