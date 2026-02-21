import { Meta, StoryObj } from '@storybook/react-vite'
import NotebookDrawer from './index'

const meta: Meta<typeof NotebookDrawer> = {
  component: NotebookDrawer,
  title: 'Pages/Drawers/NotebookDrawer',
}

export default meta
type Story = StoryObj<typeof NotebookDrawer>

const data = new Array(20).fill(0).map(() => ({
  label: 'Chapter 1',
  description: 'Chapter 1',
  id: '2',
}))

export const Default: Story = {
  render: (args) => {
    return (
      <NotebookDrawer
        data={data}
        onClickDelete={() => {}}
        onClickClose={() => {}}
        isOpen={args.isOpen}
        isLoader={args.isLoader}
      />
    )
  },
}

Default.args = {
  isOpen: true,
  isLoader: false,
}
