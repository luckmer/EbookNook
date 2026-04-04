import DefaultButton from '@components/Buttons/DefaultButton'
import ContentMeta from '@components/ContentMeta'
import { Typography } from '@components/Typography'
import { LANGUAGE } from '@interfaces/language/enums'
import clsx from 'clsx'
import { FlagComponent, GB, PL } from 'country-flag-icons/react/3x2'
import { FC, memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export interface IProps {
  onClickLanguage: (value: LANGUAGE) => void
  selectedLanguage: LANGUAGE
}

const LanguageSettings: FC<IProps> = ({ onClickLanguage, selectedLanguage }) => {
  const { t } = useTranslation()

  const countryFlag: Record<LANGUAGE, FlagComponent> = useMemo(() => {
    return {
      [LANGUAGE.ENGLISH]: GB,
      [LANGUAGE.POLISH]: PL,
    }
  }, [])

  return (
    <div className="flex flex-col gap-[36px] h-full w-full">
      <div className="flex flex-row gap-12 items-center justify-between px-24">
        <Typography text="body">{t('language')}</Typography>
        <DefaultButton
          onClick={() => {
            onClickLanguage(LANGUAGE.ENGLISH)
          }}
          className={clsx(
            'flex items-center gap-4 justify-between px-16 py-8 rounded-6 duration-200 border bg-button-secondary-background hover:bg-base border-button-secondary-background',
          )}>
          <div className="flex flex-col items-start gap-4">
            <Typography color={'white'} text="caption">
              {t('restartToDefault')}
            </Typography>
          </div>
        </DefaultButton>
      </div>
      <div className="flex flex-col gap-24 overflow-y-auto px-24 h-full">
        <div className="flex flex-col gap-12  min-[701px]:min-h-[432px] h-full">
          <ContentMeta label={t('language')} description={t('languageDescription')} />
          <div className="flex flex-col gap-8">
            {Object.values(LANGUAGE).map((preset) => {
              const Flag = countryFlag[preset]
              return (
                <DefaultButton
                  key={preset}
                  onClick={() => {
                    onClickLanguage(preset)
                  }}
                  className={clsx(
                    'flex items-center gap-4 justify-between px-16 py-8 rounded-6 duration-200 border',
                    preset === selectedLanguage
                      ? 'bg-accent-blue/50 border-accent-blue/70'
                      : 'bg-button-secondary-background/50 hover:bg-base border-button-secondary-background',
                  )}>
                  <div className="flex flex-row items-center gap-8">
                    <div className="w-[20px] h-[20px] rounded-full overflow-hidden shrink-0">
                      <Flag className="w-full h-full object-cover scale-150" />
                    </div>
                    <Typography color={'white'} text="caption">
                      {`${preset.toLocaleUpperCase().slice(0, 1)}${preset
                        .toLocaleLowerCase()
                        .slice(1)}`}
                    </Typography>
                  </div>
                </DefaultButton>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(LanguageSettings)
