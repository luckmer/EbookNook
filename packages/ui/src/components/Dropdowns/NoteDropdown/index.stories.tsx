import { Typography } from '@components/Typography'
import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import NoteDropdown from './index'

const meta: Meta<typeof NoteDropdown> = {
  title: 'Components/Dropdowns/NoteDropdown',
  component: NoteDropdown,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof NoteDropdown>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('Example note')
    const [editing, setEditing] = useState(false)

    return (
      <div style={{ width: 320 }}>
        <NoteDropdown
          label={value}
          value={value}
          isEditing={editing}
          placeholder="Write a note..."
          onChange={(v) => setValue(v)}
          onClickFocus={() => setEditing(true)}>
          {(isOpen) => (
            <div style={{ padding: 12 }}>
              <Typography text="body">
                {isOpen ? 'Dropdown content visible when hovered or editing.' : 'Hover to open'}
              </Typography>
            </div>
          )}
        </NoteDropdown>
      </div>
    )
  },
}
