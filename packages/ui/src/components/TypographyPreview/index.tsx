import { FC } from 'react'

export interface IProps {
  styles: React.CSSProperties
}

export const TypographyPreview: FC<IProps> = ({ styles }) => (
  <div className="py-12">
    <p
      style={{
        ...styles,
        fontFamily: `${styles.fontFamily ? styles.fontFamily + ', ' : ''}Raleway`,
      }}>
      The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging
      type to make written language legible, readable, and appealing when displayed.
    </p>
    <p
      style={{
        ...styles,
        fontFamily: `${styles.fontFamily ? styles.fontFamily + ', ' : ''}Raleway`,
      }}>
      The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing,
      and letter-spacing for better readability and visual appeal.
    </p>
  </div>
)

export default TypographyPreview
