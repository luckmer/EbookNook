import DefaultButton from '@components/Buttons/DefaultButton'
import { Typography } from '@components/Typography'
import { SETTINGS } from '@interfaces/settings/enums'
import { FC, memo } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { TiMinus } from 'react-icons/ti'

export interface IProps {
  onClick: (action: SETTINGS, value: number) => void
  fontWeight: number
  defaultFontSize: number
}

const FontSettings: FC<IProps> = ({ defaultFontSize, fontWeight, onClick }) => {
  return (
    <div className="flex flex-col gap-24 pt-24 h-full">
      <div className="flex flex-col gap-12">
        <Typography color="white" text="body">
          Default Font size
        </Typography>
        <div className="p-12 border flex flex-row justify-between rounded-12 border-border-popover/40 items-center">
          <Typography color="white" text="caption">
            Default Font size
          </Typography>
          <div className="flex flex-row gap-12 items-center">
            <Typography color="secondary" text="caption">
              {defaultFontSize}
            </Typography>
            <DefaultButton
              onClick={() => {
                onClick(SETTINGS.DEFAULT_FONT_SIZE, Math.max(defaultFontSize - 1, 1))
              }}
              className="transition-colors bg-button-primary-background hover:bg-button-primary-hover hover:text-text-primary text-text-secondary duration-300 rounded-full p-8">
              <TiMinus className="w-16 h-16 transition-colors duration-200" />
            </DefaultButton>
            <DefaultButton
              onClick={() => {
                onClick(SETTINGS.DEFAULT_FONT_SIZE, defaultFontSize + 1)
              }}
              className="transition-colors hover:bg-button-primary-hover  bg-button-primary-background hover:text-text-primary text-text-secondary duration-300 rounded-full p-8">
              <FaPlus className="w-16 h-16 transition-colors duration-200" />
            </DefaultButton>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        <Typography color="white" text="body">
          Font weight
        </Typography>
        <div className="p-12 border flex flex-row justify-between rounded-12 border-border-drawer/40 items-center">
          <Typography color="white" text="caption">
            Font weight
          </Typography>
          <div className="flex flex-row gap-12 items-center">
            <Typography color="secondary" text="caption">
              {fontWeight}
            </Typography>
            <DefaultButton
              onClick={() => {
                onClick(SETTINGS.FONT_WEIGHT, Math.max(fontWeight - 100, 100))
              }}
              className="transition-colors hover:bg-button-primary-hover bg-button-primary-background hover:text-text-primary text-text-secondary duration-300 rounded-full p-8">
              <TiMinus className="w-16 h-16 transition-colors duration-200" />
            </DefaultButton>
            <DefaultButton
              onClick={() => {
                onClick(SETTINGS.FONT_WEIGHT, Math.min(fontWeight + 100, 900))
              }}
              className="transition-colors hover:bg-button-primary-hover bg-button-primary-background hover:text-text-primary text-text-secondary duration-300 rounded-full p-8">
              <FaPlus className="w-16 h-16 transition-colors duration-200" />
            </DefaultButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(FontSettings)
