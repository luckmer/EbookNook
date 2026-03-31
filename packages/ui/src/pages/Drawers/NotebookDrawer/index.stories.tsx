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
  normStart: 2,
  normEnd: 2,
}))

const notes = new Array(20).fill(0).map(() => ({
  label: 'Chapter 1',
  description: 'Chapter 1',
  id: '2',
  annotated: true,
  normStart: 2,
  normEnd: 2,
}))

export const Default: Story = {
  render: (args) => {
    return (
      <NotebookDrawer
        highlights={data}
        notes={notes}
        onClickFocusNote={() => {}}
        onClickDeleteHighlight={() => {}}
        onClickDeleteNote={() => {}}
        onClickCancel={() => {}}
        onClickSave={() => {}}
        onClickClose={() => {}}
        editingNoteId=""
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
