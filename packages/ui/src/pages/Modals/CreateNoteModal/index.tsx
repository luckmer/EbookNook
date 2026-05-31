import DefaultButton from '@components/Buttons/DefaultButton'
import DefaultInput from '@components/Inputs/DefaultInput'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { Typography } from '@components/Typography'
import { useWindowSize } from '@hooks/useWindowSize'
import { colors } from '@package-utils/static'
import { getDate, getTime } from '@package-utils/utils'
import clsx from 'clsx'
import { type FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoMdColorPalette, IoMdTime } from 'react-icons/io'
import { IoTextOutline } from 'react-icons/io5'
import { MdMenuBook } from 'react-icons/md'

export interface IProps {
  onClickClose: () => void
  onClickSaveNote: (note: string, color: string) => void
  isOpen: boolean
  selectedText: string
  book: string
  createdAt: string
}

const CreateNoteModal: FC<IProps> = ({
  onClickClose,
  onClickSaveNote,
  isOpen,
  selectedText,
  book,
  createdAt,
}) => {
  const [noteName, setNoteName] = useState('')
  const [selectedColor, setSelectedColor] = useState('#4DA3FF')

  const { width } = useWindowSize()
  const isMobile = useMemo(() => width <= 700, [width])
  const { t } = useTranslation()

  useEffect(() => {
    if (isOpen) {
      setNoteName('')
    }
  }, [isOpen])

  const date = useMemo(() => {
    const { day, month, year } = getDate(createdAt)
    return `${day} ${t(month)} ${year}`
  }, [createdAt, t])

  const time = useMemo(() => {
    const { hours, minutes, isAM } = getTime(createdAt)
    return `${hours}:${minutes} ${isAM ? 'AM' : 'PM'}`
  }, [createdAt])

  return (
    <Modal
      isFooter={false}
      onClickClose={onClickClose}
      isOpen={isOpen}
      centered
      isFullscreen={isMobile}
      width={isMobile ? '100%' : 500}
      height={isMobile ? '100%' : undefined}
      closable={false}>
      <div
        className={clsx(
          'flex flex-col  h-full w-full overflow-hidden',
          isMobile ? 'h-full' : 'max-h-[700px]',
        )}>
        <ModalHeader onClickClose={onClickClose} label={'Note preivew'} />
        <div className='overflow-y-auto px-24 py-24 h-full'>
          <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-12 p-12 bg-base rounded-6 border-border-subtle border'>
              <Typography text='caption' color='muted'>
                {t('selectedText')}
              </Typography>
              <Typography text='caption' color='secondary'>
                {selectedText}
              </Typography>
            </div>
            <div className='flex flex-col gap-12 p-12 bg-base rounded-6 w-full border-border-subtle border'>
              <div className='flex flex-row gap-6 items-center'>
                <MdMenuBook className='text-text-muted' />
                <Typography text='caption' color='muted'>
                  {t('book')}
                </Typography>
              </div>
              <Typography text='caption' color='secondary'>
                {book}
              </Typography>
            </div>
            <div className='flex flex-row gap-12 w-full'>
              <div className='flex flex-col gap-12 p-12 bg-base rounded-6 w-full border-border-subtle border'>
                <div className='flex flex-row gap-6 items-center'>
                  <IoTextOutline className='text-text-muted' />
                  <Typography text='caption' color='muted'>
                    {t('words')}
                  </Typography>
                </div>
                <Typography text='caption' color='secondary'>
                  {selectedText.length} {t('words').toLocaleLowerCase()}
                </Typography>
              </div>
              <div className='flex flex-col gap-12 p-12 bg-base rounded-6 w-full border-border-subtle border'>
                <div className='flex flex-row gap-6 items-center'>
                  <IoMdTime className='text-text-muted' />
                  <Typography text='caption' color='muted'>
                    {t('created')}
                  </Typography>
                </div>
                <div className='flex flex-col gap-4'>
                  <Typography text='caption' color='secondary'>
                    {date}
                  </Typography>
                  <Typography text='small' color='secondary'>
                    {time}
                  </Typography>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-12 p-12 bg-base rounded-6 border-border-subtle border'>
              <div className='flex flex-row gap-6 items-center'>
                <IoMdColorPalette className='text-text-muted' />
                <Typography text='caption' color='muted'>
                  {t('highlightColor')}
                </Typography>
              </div>
              <div className='flex flex-wrap gap-6 items-center  '>
                {colors.map((color) => {
                  return (
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        if (selectedColor === color) {
                          setSelectedColor('#4DA3FF')
                        } else {
                          setSelectedColor(color)
                        }
                      }}
                      key={color}
                      className={clsx(
                        'w-[24px] h-[24px] rounded-full cursor-pointer',
                        'border-2',
                        selectedColor === color ? 'border-text-primary' : 'border-transparent',
                      )}
                      style={{ backgroundColor: color }}
                    />
                  )
                })}
              </div>
            </div>
            <div className='flex flex-col gap-12 p-12 bg-base rounded-6 border-border-subtle border'>
              <Typography text='caption' color='muted'>
                {t('noteName')}
              </Typography>
              <DefaultInput
                className='h-full w-full py-12 rounded-4 px-12 font-ubuntu border border-border-subtle bg-deep'
                onChange={setNoteName}
                value={noteName}
                placeholder={t('enterNoteName')}
              />
            </div>
          </div>
        </div>
        <div className='w-full flex flex-row items-center justify-end gap-12 pb-24 px-24 pt-24 border-t border-border-modal'>
          <DefaultButton
            onClick={onClickClose}
            className='px-24 py-12 w-full bg-button-primary-active hover:bg-button-primary-hover rounded-4 duration-150 h-full'>
            <Typography text='caption'>{t('cancel')}</Typography>
          </DefaultButton>
          <DefaultButton
            disabled={!noteName.trim().toLocaleLowerCase().length}
            onClick={() => {
              onClickSaveNote(noteName, selectedColor)
            }}
            className='px-24 py-12 w-full bg-button-secondary-active hover:bg-button-primary-hover rounded-4 duration-150 h-full'>
            <Typography text='caption'>{t('saveNote')}</Typography>
          </DefaultButton>
        </div>
      </div>
    </Modal>
  )
}

export default CreateNoteModal
