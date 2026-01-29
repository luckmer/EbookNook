import DefaultButton from '@components/Buttons/DefaultButton'
import ContentMeta from '@components/ContentMeta'
import RangeInput from '@components/Inputs/RangeInput'
import { Typography } from '@components/Typography'
import { SETTINGS } from '@interfaces/settings/enums'
import clsx from 'clsx'
import { FC, memo } from 'react'

export interface IProps {
  onClick: (action: SETTINGS, value: number) => void
  onClickRestart: () => void
  fontWeight: number
  defaultFontSize: number
  children: React.ReactNode
}

const FontSettings: FC<IProps> = ({
  defaultFontSize,
  fontWeight,
  onClick,
  onClickRestart,
  children,
}) => {
  const sizePresets = [
    { label: 'Small', value: 12 },
    { label: 'Regular', value: 14 },
    { label: 'Medium', value: 16 },
    { label: 'Large', value: 20 },
    { label: 'Extra Large', value: 24 },
  ]

  const weightPresets = [
    { label: 'Light', value: 300 },
    { label: 'Regular', value: 400 },
    { label: 'Medium', value: 500 },
    { label: 'Semi Bold', value: 600 },
    { label: 'Bold', value: 700 },
  ]

  return (
    <div className="flex flex-col gap-[36px] h-full w-full">
      <div className="flex flex-row gap-12 items-center justify-between px-24">
        <Typography text="body">Font</Typography>
        <DefaultButton
          onClick={onClickRestart}
          className={clsx(
            'flex items-center gap-4 justify-between px-16 py-8 rounded-6 duration-200 border bg-button-secondary-background hover:bg-base border-button-secondary-background',
          )}>
          <div className="flex flex-col items-start gap-4">
            <Typography color={'white'} text="caption">
              Restart to default
            </Typography>
          </div>
        </DefaultButton>
      </div>
      <div className="flex flex-col gap-24 overflow-y-auto px-24">
        <div className="flex flex-col gap-12">
          <ContentMeta label="Font Size" description="Adjust text size for better readability" />
          <div className="flex flex-wrap gap-8 ">
            {sizePresets.map((preset) => (
              <DefaultButton
                key={preset.label}
                onClick={() => {
                  onClick(SETTINGS.DEFAULT_FONT_SIZE, preset.value)
                }}
                className={clsx(
                  'flex items-center gap-4 justify-between px-16 py-8 rounded-6  duration-200 border ',
                  preset.value === defaultFontSize
                    ? 'bg-accent-blue border-accent-blue'
                    : 'bg-button-secondary-background hover:bg-base border-button-secondary-background',
                )}>
                <div className="flex flex-col items-start gap-4">
                  <Typography color={'white'} text="caption">
                    {preset.label}
                  </Typography>
                </div>
              </DefaultButton>
            ))}
          </div>
          <RangeInput
            min={12}
            max={24}
            step={1}
            value={defaultFontSize}
            onChange={(value) => {
              onClick(SETTINGS.DEFAULT_FONT_SIZE, value)
            }}
          />
        </div>
        <div className="flex flex-col gap-12">
          <ContentMeta label="Font Weight" description="Control the thickness of text" />
          <div className="flex flex-wrap gap-8">
            {weightPresets.map((preset) => (
              <DefaultButton
                key={preset.label}
                onClick={() => {
                  onClick(SETTINGS.FONT_WEIGHT, preset.value)
                }}
                className={clsx(
                  'flex items-center gap-4 justify-between px-16 py-8 rounded-6  duration-200 border ',
                  preset.value === fontWeight
                    ? 'bg-accent-blue border-accent-blue'
                    : 'bg-button-secondary-background hover:bg-base border-button-secondary-background',
                )}>
                <div className="flex flex-col items-start gap-4">
                  <Typography color={'white'} text="caption">
                    {preset.label}
                  </Typography>
                </div>
              </DefaultButton>
            ))}
          </div>
          <RangeInput
            min={100}
            max={900}
            step={100}
            value={fontWeight}
            onChange={(value) => {
              if (value) {
                onClick(SETTINGS.FONT_WEIGHT, value)
              }
            }}
          />
        </div>
        <div className="bg-button-secondary-background p-16 rounded-8 flex flex-col gap-8 ">
          <Typography text="small" color="secondary">
            Preview ({defaultFontSize}px, {fontWeight})
          </Typography>
          {children}
        </div>
      </div>
    </div>
  )
}

export default memo(FontSettings)
