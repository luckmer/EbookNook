import { Meta, StoryObj } from '@storybook/react-vite'
import Home from '.'

const meta: Meta<typeof Home> = {
  component: Home,
  title: 'Pages/Home',
}

export default meta
type Story = StoryObj<typeof Home>

export const Default: Story = {
  render: () => {
    return <Home hasBooks={false} onClick={() => {}} onClickBook={() => {}} books={[]} />
  },
}
