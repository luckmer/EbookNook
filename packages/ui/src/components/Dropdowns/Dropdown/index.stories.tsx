import { Typography } from '@components/Typography'
import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import Dropdown from './index'

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdowns/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof Dropdown>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div style={{ width: 320 }}>
        <Dropdown label="Dropdown label" isOpen={open} onToggle={() => setOpen(!open)}>
          <Typography text="body">This is dropdown content.</Typography>
        </Dropdown>
      </div>
    )
  },
}
