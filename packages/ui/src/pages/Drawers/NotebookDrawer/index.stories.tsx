import { Meta, StoryObj } from '@storybook/react-vite'
import NotebookDrawer from './index'

const meta: Meta<typeof NotebookDrawer> = {
  component: NotebookDrawer,
  title: 'Pages/Drawers/NotebookDrawer',
}

export default meta
type Story = StoryObj<typeof NotebookDrawer>

export const Default: Story = {
  render: (args) => {
    return (
      <NotebookDrawer
        data={['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5']}
        onClickClose={() => {}}
        isOpen={args.isOpen}
      />
    )
  },
}

Default.args = {
  isOpen: true,
}
