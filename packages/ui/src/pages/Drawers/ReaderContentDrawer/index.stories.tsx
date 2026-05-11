import { Meta, StoryObj } from '@storybook/react-vite'
import ReaderContentDrawer from '.'

const meta: Meta<typeof ReaderContentDrawer> = {
  component: ReaderContentDrawer,
  title: 'Pages/Drawers/ReaderContentDrawer',
}

export default meta
type Story = StoryObj<typeof ReaderContentDrawer>

export const Default: Story = {
  render: (args) => {
    return (
      <ReaderContentDrawer
        isOpen
        activeToc={{
          href: 'epub30-overview.xhtml#sec-intro',
          label: '1. Introduction',
          subitems: [],
        }}
        isLoader={args.isLoader}
        onClickBack={() => {}}
        onClick={() => {}}
        onClickClose={() => {}}
        icon=""
        author="Author"
        title="Title"
        toc={[
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
        ]}
      />
    )
  },
}

Default.args = {
  isLoader: false,
}
