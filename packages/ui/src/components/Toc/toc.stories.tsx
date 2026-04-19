import { Meta, StoryObj } from '@storybook/react-vite'
import Toc from './index'

const meta: Meta<typeof Toc> = {
  component: Toc,
  title: 'Components/Toc',
}

export default meta
type Story = StoryObj<typeof Toc>

export const Default: Story = {
  render: () => {
    return (
      <Toc
        activeToc={{
          href: 'epub30-overview.xhtml#sec-intro',
          label: '1. Introduction',
          subitems: [],
        }}
        onClick={() => {}}
        item={{
          href: 'epub30-overview.xhtml',
          label: 'EPUB 3 Overview',
          subitems: [
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
        }}
        level={0}
      />
    )
  },
}
