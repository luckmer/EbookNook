import { languageSelector } from '@store/selectors/language'
import i18n from 'i18next'
import { FC, JSX, useEffect, useState } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { useSelector } from 'react-redux'
import { LANGUAGE } from '../interfaces/language/enums'
import { resources } from './resources'

export interface IProps {
  children: JSX.Element
}

const i18nInstance = i18n.createInstance()

export const I18Provider: FC<IProps> = ({ children }) => {
  const lng = useSelector(languageSelector.language)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    i18nInstance
      .use(initReactI18next)
      .init({
        resources,
        lng,
        fallbackLng: LANGUAGE.POLISH,
        interpolation: { escapeValue: false },
      })
      .then(() => setReady(true))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (ready) {
      i18nInstance.changeLanguage(lng).catch(console.error)
    }
  }, [lng, ready])

  if (!ready) return null

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}
