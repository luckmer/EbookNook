import type { Meta, StoryObj } from '@storybook/react-vite'
import ContentsLayout from '.'

const meta: Meta<typeof ContentsLayout> = {
  component: ContentsLayout,
  title: 'Pages/Drawers/ReaderContentDrawer/ContentsLayout',
}

export default meta
type Story = StoryObj<typeof ContentsLayout>

export const Default: Story = {
  render: (args) => {
    return <ContentsLayout {...args} />
  },
}

Default.args = {
  toc: [
    {
      href: 'epub30-overview.xhtml#sec-intro',
      label: '1. Introduction',
      subitems: new Array(6).fill(0).map(() => ({
        href: 'epub30-overview.xhtml#sec-intro',
        id: 'epub30-overview.xhtml#sec-intro',
        label: '1. Introduction',
        parent: 'ovw',
        subitems: [],
      })),
    },
    {
      href: 'epub30-overview.xhtml#sec-intro',
      label: '1. Introduction',
      subitems: new Array(6).fill(0).map(() => ({
        href: 'epub30-overview.xhtml#sec-intro',
        id: 'epub30-overview.xhtml#sec-intro',
        label: '1. Introduction',
        parent: 'ovw',
        subitems: [],
      })),
    },
  ],
  activeToc: {} as any,
  isLoader: false,
  onClick: () => {},
}
