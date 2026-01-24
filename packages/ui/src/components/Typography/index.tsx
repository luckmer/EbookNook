import { typography } from '@common/typography'
import { VariantProps } from 'class-variance-authority'
import { CSSProperties } from 'react'

export interface IProps {
  class?: string
  children: React.ReactNode
  style?: CSSProperties
}

export interface TypographyProps extends IProps, VariantProps<typeof typography> {}

export const Typography: React.FC<TypographyProps> = (props) => (
  <p
    style={props.style}
    className={typography({
      ...props,
      class: props.class,
    })}>
    {props.children}
  </p>
)
