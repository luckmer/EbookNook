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
        onClick={() => {}}
        item={{
          href: 'epub30-overview.xhtml',
          id: 'ovw',
          label: 'EPUB 3 Overview',
          subitems: [
            {
              href: 'epub30-overview.xhtml#sec-intro',
              id: 'epub30-overview.xhtml#sec-intro',
              label: '1. Introduction',
              parent: 'ovw',
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
              id: 'epub30-overview.xhtml#sec-intro',
              label: '1. Introduction',
              parent: 'ovw',
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
              id: 'epub30-overview.xhtml#sec-intro',
              label: '1. Introduction',
              parent: 'ovw',
              subitems: new Array(6).fill(0).map(() => ({
                href: 'epub30-overview.xhtml#sec-intro',
                id: 'epub30-overview.xhtml#sec-intro',
                label: '1. Introduction',
                parent: 'ovw',
                subitems: [],
              })),
            },
          ],
          parent: undefined,
        }}
        level={0}
      />
    )
  },
}
