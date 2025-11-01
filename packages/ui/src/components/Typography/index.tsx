import { typography } from '@common/typography'
import { VariantProps } from 'class-variance-authority'

export interface IProps {
  class?: string
  children: React.ReactNode
}

export interface TypographyProps extends IProps, VariantProps<typeof typography> {}

export const Typography: React.FC<TypographyProps> = (props) => (
  <p
    className={typography({
      ...props,
      class: props.class,
    })}>
    {props.children}
  </p>
)
