import { Meta, StoryObj } from '@storybook/react-vite'
import ChaptersDrawer from '.'

const meta: Meta<typeof ChaptersDrawer> = {
  component: ChaptersDrawer,
  title: 'Pages/ChaptersDrawer',
}

export default meta
type Story = StoryObj<typeof ChaptersDrawer>

export const Default: Story = {
  render: () => {
    return (
      <ChaptersDrawer
        isOpen
        onClickBack={() => {}}
        onClick={() => {}}
        onClickClose={() => {}}
        icon=""
        author="Author"
        title="Title"
        toc={[
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
        ]}
      />
    )
  },
}
