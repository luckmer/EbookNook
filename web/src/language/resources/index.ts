import { IDictionary } from '../../interfaces/language'
import { LANGUAGE } from '../../interfaces/language/enums'
import { english } from '../language/english'
import { polish } from '../language/polish'

export const resources: Record<LANGUAGE, { translation: IDictionary }> = {
  [LANGUAGE.ENGLISH]: {
    translation: english,
  },
  [LANGUAGE.POLISH]: {
    translation: polish,
  },
}
