import DefaultButton from '@components/Buttons/DefaultButton'
import DefaultInput from '@components/Inputs/DefaultInput'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { Typography } from '@components/Typography'
import { useWindowSize } from '@hooks/useWindowSize'
import clsx from 'clsx'
import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface IProps {
  onClickClose: () => void
  onClickCreateBookmark: (bookmarkName: string) => void
  isOpen: boolean
}

const CreateBookmarkModal: FC<IProps> = ({ onClickClose, onClickCreateBookmark, isOpen }) => {
  const [bookmarkName, setBookmarkName] = useState('')
  const { width } = useWindowSize()
  const isMobile = useMemo(() => width <= 700, [width])
  const { t } = useTranslation()

  useEffect(() => {
    if (isOpen) {
      setBookmarkName('')
    }
  }, [isOpen])

  return (
    <Modal
      isFooter={false}
      onClickClose={onClickClose}
      isOpen={isOpen}
      centered
      isFullscreen={isMobile}
      width={isMobile ? '100%' : 450}
      height={isMobile ? '100%' : undefined}
      closable={false}>
      <div
        className={clsx(
          'flex flex-col  h-full w-full overflow-hidden',
          isMobile ? 'h-full' : 'max-h-[700px]',
        )}>
        <ModalHeader onClickClose={onClickClose} label={t('createBookmark')} />
        <div className="flex flex-col overflow-hidden w-full flex-1 py-24">
          <div className="flex flex-col items-start justify-end gap-8 w-full px-24 pb-12">
            <Typography text="caption" color="muted">
              {t('name')}
            </Typography>
            <DefaultInput
              className="h-full w-full py-12 rounded-4 px-12 font-ubuntu border border-border-subtle"
              onChange={setBookmarkName}
              value={bookmarkName}
              placeholder={t('bookmarkNamePlaceholder')}
            />
          </div>
        </div>
        <div className="w-full flex flex-row items-center justify-end gap-12 pb-24 px-24">
          <DefaultButton
            onClick={onClickClose}
            className="px-24 py-12 w-full bg-button-primary-active hover:bg-button-primary-hover rounded-4 duration-150 h-full">
            <Typography text="caption">{t('cancel')}</Typography>
          </DefaultButton>
          <DefaultButton
            disabled={!bookmarkName.trim().toLocaleLowerCase().length}
            onClick={() => {
              onClickCreateBookmark(bookmarkName)
            }}
            className="px-24 py-12 w-full bg-button-secondary-active hover:bg-button-primary-hover rounded-4 duration-150 h-full">
            <Typography text="caption">{t('createBookmark')}</Typography>
          </DefaultButton>
        </div>
      </div>
    </Modal>
  )
}

export default CreateBookmarkModal
