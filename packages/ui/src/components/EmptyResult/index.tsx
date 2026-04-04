import { Typography } from '@components/Typography'
import { useTranslation } from 'react-i18next'

const EmptyResult = () => {
  const { t } = useTranslation()
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-32 max-w-[600px] mx-auto px-12">
      <Typography text="h1" class="text-[48px]! leading-[50px] text-center">
        {t('noResults')}
      </Typography>
      <Typography text="body" center class="leading-[24px] text-center">
        {t('noResultsDescription')}
      </Typography>
    </div>
  )
}

export default EmptyResult
