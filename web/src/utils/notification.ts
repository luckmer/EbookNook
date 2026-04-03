import { toast } from 'sonner'

export const notify = (error: string) =>
  toast(error, {
    classNames: {
      actionButton: '!bg-transparent',
      toast: '!bg-surface-drawer !border-notification-neutral-border',
      title: '!text-[#fff]',
    },
    action: {
      label: 'X',
      onClick: () => {},
    },
  })
