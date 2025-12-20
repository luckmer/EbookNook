import { Meta, StoryObj } from '@storybook/react-vite'
import Reader from './index'

const meta: Meta<typeof Reader> = {
  component: Reader,
  title: 'Pages/Reader',
}

export default meta
type Story = StoryObj<typeof Reader>

export const BannersStory: Story = {
  render: () => {
    return (
      <Reader
        epubCodeSearch=""
        selectedChapter=""
        hideContent={false}
        onHideHeader={() => {}}
        onShowHeader={() => {}}
        settings={{
          defaultFontSize: 16,
          fontWeight: 400,
          wordSpacing: 0,
          letterSpacing: 0,
          textIndent: 0,
          lineHeight: 1.5,
        }}
      />
    )
  },
}
