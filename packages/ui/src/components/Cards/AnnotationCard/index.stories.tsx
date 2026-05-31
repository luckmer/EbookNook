import type { Meta, StoryObj } from '@storybook/react-vite'
import AnnotationCard, { type IProps } from './index'

const meta: Meta<typeof AnnotationCard> = {
  component: AnnotationCard,
  title: 'Components/Cards/AnnotationCard',
}

export default meta
type Story = StoryObj<typeof AnnotationCard>

export const Default: Story = {
  render: (args) => {
    return <AnnotationCard {...args} onClick={() => {}} />
  },
}

const args: IProps = {
  isDeleting: false,
  isUpdating: false,
  onClickDelete: () => {},
  onClickEdit: () => {},
  title: 'Chapter 1',
  chapter: 'Chapter 1',
  createdAt: Date.now().toString(),
  onClick: () => {},
}

Default.args = args
