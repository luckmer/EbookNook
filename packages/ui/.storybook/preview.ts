import * as React from 'react'
import type { Preview } from '@storybook/react-vite'
import '../common/tailwind/tailwind.css'

;(globalThis as any).React = React

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
