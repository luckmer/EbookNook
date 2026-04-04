import { toast } from 'sonner'

export const notify = (error: string, status: 'error' | 'success' | 'warning' | 'info') =>
  toast[status](error, {
    classNames: {
      actionButton: '!bg-transparent',
      toast: '!bg-surface-drawer !border-button-primary-hover',
      title: '!text-[#fff]',
    },
    action: {
      label: 'X',
      onClick: () => {},
    },
  })
