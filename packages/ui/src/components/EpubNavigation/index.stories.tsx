import { Meta, StoryObj } from '@storybook/react-vite'
import EpubNavigation from './index'

const meta: Meta<typeof EpubNavigation> = {
  component: EpubNavigation,
  title: 'Components/EpubNavigation',
}

export default meta
type Story = StoryObj<typeof EpubNavigation>

export const BannersStory: Story = {
  render: () => {
    return (
      <EpubNavigation
        hideContent
        currentPage={1}
        totalPage={1}
        onClickNextChapter={() => {}}
        onClickPrevChapter={() => {}}
        onClickNextPage={() => {}}
        onClickPrevPage={() => {}}>
        Content
      </EpubNavigation>
    )
  },
}
