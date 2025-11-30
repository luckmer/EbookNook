import DefaultButton from '@components/Buttons/DefaultButton'
import { Typography } from '@components/Typography'
import { SETTINGS } from '@interfaces/settings/enums'
import { FC } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { TiMinus } from 'react-icons/ti'

export interface IProps {
  onClick: (action: SETTINGS, value: number) => void
  lineHeight: number
  wordSpacing: number
  letterSpacing: number
  textIndent: number
}

const LayoutSettings: FC<IProps> = ({
  onClick,
  wordSpacing,
  letterSpacing,
  textIndent,
  lineHeight,
}) => {
  const settings = [
    { label: 'Word spacing', value: wordSpacing, key: SETTINGS.WORD_SPACING, step: 0.5 },
    { label: 'Letter spacing', value: letterSpacing, key: SETTINGS.LETTER_SPACING, step: 0.5 },
    { label: 'Text indent', value: textIndent, key: SETTINGS.TEXT_INDENT, step: 1 },
    { label: 'Line height', value: lineHeight, key: SETTINGS.LINE_HEIGHT, step: 1 },
  ]

  return (
    <div className="flex flex-col gap-24 pt-24 h-full">
      <div className="flex flex-col gap-12">
        <Typography color="white" text="body">
          Paragraph
        </Typography>
        <div className="flex flex-col">
          {settings.map((s, index) => {
            const borderClass =
              index === 0
                ? 'rounded-tl-12 rounded-tr-12'
                : index === settings.length - 1
                ? 'rounded-b-12 border-t-0'
                : 'border-t-0 border-b'

            return (
              <div
                key={s.key}
                className={`p-12 border flex flex-row justify-between items-center border-border-popover/40 ${borderClass}`}>
                <Typography color="white" text="caption">
                  {s.label}
                </Typography>
                <div className="flex flex-row gap-12 items-center">
                  <Typography color="secondary" text="caption">
                    {s.value}
                  </Typography>
                  <DefaultButton
                    onClick={() => onClick(s.key, s.value - s.step)}
                    className="transition-colors bg-button-primary-background hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-full p-8">
                    <TiMinus className="w-16 h-16 transition-colors duration-200" />
                  </DefaultButton>
                  <DefaultButton
                    onClick={() => onClick(s.key, s.value + s.step)}
                    className="transition-colors bg-button-primary-background hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-full p-8">
                    <FaPlus className="w-16 h-16 transition-colors duration-200" />
                  </DefaultButton>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default LayoutSettings
