import { FC } from 'react'

export interface IProps {
  styles: React.CSSProperties
}

export const TypographyPreview: FC<IProps> = ({ styles }) => (
  <div className="space-y-4">
    <p style={styles}>
      The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging
      type to make written language legible, readable, and appealing when displayed.
    </p>
    <p style={styles}>
      The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing,
      and letter-spacing for better readability and visual appeal.
    </p>
  </div>
)

export default TypographyPreview
