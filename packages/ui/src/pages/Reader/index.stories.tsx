import { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'
import Reader from './index'

const meta: Meta<typeof Reader> = {
  component: Reader,
  title: 'Pages/Reader',
}

export default meta
type Story = StoryObj<typeof Reader>

export const BannersStory: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    return (
      <Reader
        containerRef={containerRef}
        sectionInfo={{
          current: 1,
          total: 20,
        }}
        onHideHeader={() => {}}
        onShowHeader={() => {}}
        onClickNextChapter={() => {}}
        onClickPrevChapter={() => {}}
        onClickNextPage={() => {}}
        onClickPrevPage={() => {}}
        pageInfo={{ current: 1, total: 1, percentage: 0 }}
        loading={false}
        hideContent
      />
    )
  },
}
