import DefaultButton from '@components/Buttons/DefaultButton'
import ContentMeta from '@components/ContentMeta'
import RangeInput from '@components/Inputs/RangeInput'
import { Typography } from '@components/Typography'
import { SETTINGS } from '@interfaces/settings/enums'
import { FC, memo, useMemo } from 'react'

export interface IProps {
  onClick: (action: SETTINGS, value: number) => void
  onClickRestart: () => void
  lineHeight: number
  wordSpacing: number
  paragraphMargin: number
  letterSpacing: number
  textIndent: number
  children: React.ReactNode
}

const LayoutSettings: FC<IProps> = ({
  onClick,
  onClickRestart,
  wordSpacing,
  letterSpacing,
  textIndent,
  lineHeight,
  paragraphMargin,
  children,
}) => {
  const settingsConfig = useMemo(() => {
    return [
      {
        label: 'Word Spacing',
        description: 'Control the space between words',
        min: -5,
        max: 20,
        value: wordSpacing,
        type: SETTINGS.WORD_SPACING,
      },
      {
        label: 'Letter Spacing',
        description: 'Control the space between letters',
        min: -2,
        max: 10,
        value: letterSpacing,
        type: SETTINGS.LETTER_SPACING,
      },
      {
        label: 'Text Indent',
        description: 'Set the indentation of the first line',
        min: 0,
        max: 50,
        value: textIndent,
        type: SETTINGS.TEXT_INDENT,
      },
      {
        label: 'Line Height',
        description: 'Control the spacing between lines',
        min: 1,
        max: 3,
        step: 0.1,
        value: lineHeight,
        type: SETTINGS.LINE_HEIGHT,
      },
      {
        label: 'Paragraph Margin',
        description: 'Space between paragraphs',
        min: 0,
        max: 50,
        step: 1,
        value: paragraphMargin,
        type: SETTINGS.PARAGRAPH_MARGIN,
      },
    ]
  }, [wordSpacing, letterSpacing, textIndent, lineHeight, paragraphMargin])

  return (
    <div className="flex flex-col gap-[36px] h-full w-full">
      <div className="flex flex-row gap-12 items-center justify-between  px-24">
        <Typography text="body">Layout</Typography>
        <DefaultButton
          onClick={onClickRestart}
          className="flex items-center gap-4 justify-between px-16 py-8 rounded-6 duration-200 border bg-button-secondary-background hover:bg-base border-button-secondary-background">
          <div className="flex flex-col items-start gap-4">
            <Typography color={'white'} text="caption">
              Restart to default
            </Typography>
          </div>
        </DefaultButton>
      </div>
      <div className="flex flex-col gap-24 overflow-y-auto px-24">
        {settingsConfig.map((item) => (
          <div className="flex flex-col gap-12" key={item.type}>
            <ContentMeta label={item.label} description={item.description} />
            <RangeInput
              min={item.min}
              max={item.max}
              step={item.step}
              value={item.value}
              onChange={(value) => {
                if (value) {
                  onClick(item.type, value)
                }
              }}
            />
          </div>
        ))}
        <div className="bg-button-secondary-background p-16 rounded-8 flex flex-col gap-8 ">
          <Typography text="small" color="secondary">
            Layout preview
          </Typography>
          {children}
        </div>
      </div>
    </div>
  )
}

export default memo(LayoutSettings)
