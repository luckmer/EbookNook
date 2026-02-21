import { Meta, StoryObj } from '@storybook/react-vite'
import Annotator from './index'

const meta: Meta<typeof Annotator> = {
  component: Annotator,
  title: 'Pages/Annotator',
}

export default meta
type Story = StoryObj<typeof Annotator>

export const BannersStory: Story = {
  render: () => {
    return (
      <Annotator
        modalPosition={{
          top: `${0}px`,
          left: `${0}px`,
          width: `${100}px`,
          minHeight: `${50}px`,
        }}
        pointPosition={{
          left: `${20}px`,
          top: `-${9}px`,
          transform: 'translateX(-50%)',
          borderLeft: `${9}px solid transparent`,
          borderRight: `${9}px solid transparent`,
          borderBottom: `${9}px solid #4B5563`,
          width: 0,
          height: 0,
        }}
        // onClickCustomCopy={() => {}}
        onClickCopy={() => {}}
      />
    )
  },
}
