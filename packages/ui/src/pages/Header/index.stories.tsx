import { Meta, StoryObj } from '@storybook/react-vite'
import Header from './index'

const meta: Meta<typeof Header> = {
  component: Header,
  title: 'Pages/Header',
}

export default meta
type Story = StoryObj<typeof Header>

export const BannersStory: Story = {
  render: () => {
    return (
      <Header
        hideHeader={false}
        location="/"
        onClickOpenSidebar={() => {}}
        onClickSettings={() => {}}
        onClickClose={() => {}}
        onClickMaximize={() => {}}
        onClickMinimize={() => {}}
        onChange={() => {}}
        value=""
      />
    )
  },
}
