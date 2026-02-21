import Show from '@components/Show'
import { getEventEmitter } from '@libs/eventEmitter'
import Annotator from '@pages/Annotator'
import { actions as annotationActions } from '@store/reducers/annotations'
import { actions as uiActions } from '@store/reducers/ui'
import {
  DEFAULT_ANNOTATION_STATE,
  GAP,
  PADDING,
  POPUP_HEIGHT,
  POPUP_WIDTH,
  TRIANGLE_SIZE,
} from '@utils/static'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { v7 } from 'uuid'

interface IPosition {
  x: number
  y: number
  triangleX: number
}

interface IDetail {
  selected: Selection
  doc: Document
  iframe: HTMLIFrameElement
}

const AnnotatorRoot = () => {
  const [doc, setDoc] = useState<Document | null>(null)
  const [position, setPosition] = useState<IPosition>(DEFAULT_ANNOTATION_STATE)
  const [showAnnotator, setShowAnnotator] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const dispatch = useDispatch()
  const location = useLocation()

  const bookId = useMemo(() => location?.state?.id, [location])

  useEffect(() => {
    const emitter = getEventEmitter()

    const handleAnnotationClick = ({ detail }: { detail: IDetail }) => {
      const selection = detail.selected
      const text = selection?.toString() ?? ''
      setDoc(detail.doc)
      if (!text.trim().length) {
        setShowAnnotator(false)
        return
      }

      const range = selection.getRangeAt(0)

      const iframeRect = detail.iframe.getBoundingClientRect()
      const clientRects = Array.from(range.getClientRects())

      const transformedRects = clientRects.map((rect) => {
        return {
          left: rect.left + iframeRect.left,
          right: rect.right + iframeRect.left,
          top: rect.top + iframeRect.top,
          bottom: rect.bottom + iframeRect.top,
        }
      })

      const lastRect = transformedRects.at(-1)

      if (!lastRect) {
        setShowAnnotator(false)
        return
      }

      const targetX = (lastRect.left + lastRect.right) / 2
      const targetY = lastRect.bottom

      let popupX = targetX - POPUP_WIDTH / 2
      let popupY = targetY + TRIANGLE_SIZE + GAP

      popupX = Math.max(PADDING, Math.min(popupX, window.innerWidth - POPUP_WIDTH - PADDING))
      popupY = Math.max(PADDING, Math.min(popupY, window.innerHeight - POPUP_HEIGHT - PADDING))

      const triangleX = Math.max(
        TRIANGLE_SIZE,
        Math.min(targetX - popupX, POPUP_WIDTH - TRIANGLE_SIZE),
      )

      setPosition({ x: popupX, y: popupY, triangleX })
      setSelectedText(text)
      setShowAnnotator(true)
    }

    emitter.on('annotationClick', handleAnnotationClick)
    emitter.on('restartAnnotator', () => {
      setPosition(DEFAULT_ANNOTATION_STATE)
      setShowAnnotator(false)
      setSelectedText('')
    })

    return () => {
      emitter.off('annotationClick', handleAnnotationClick)
    }
  }, [])

  const modalPosition = useMemo(() => {
    return {
      top: `${position.y}px`,
      left: `${position.x}px`,
      width: `${POPUP_WIDTH}px`,
      minHeight: `${POPUP_HEIGHT}px`,
    }
  }, [position.y, position.x])

  const pointPosition = useMemo(() => {
    return {
      left: `${position.triangleX}px`,
      top: `-${TRIANGLE_SIZE}px`,
      transform: 'translateX(-50%)',
      borderLeft: `${TRIANGLE_SIZE}px solid transparent`,
      borderRight: `${TRIANGLE_SIZE}px solid transparent`,
      borderBottom: `${TRIANGLE_SIZE}px solid #2A2A2A`,
      width: 0,
      height: 0,
    }
  }, [position.triangleX])

  const removeSelection = useCallback(() => {
    if (doc) {
      const selection = doc.getSelection()
      if (selection) {
        selection.removeAllRanges()
      }
    }
  }, [doc])

  return (
    <Show when={showAnnotator}>
      <Annotator
        onClickCopy={() => {
          dispatch(uiActions.setOpenNotebook(true))
          dispatch(
            annotationActions.setAnnotation({
              id: bookId,
              annotation: { label: selectedText, description: selectedText, id: v7() },
            }),
          )
          setPosition(DEFAULT_ANNOTATION_STATE)
          setShowAnnotator(false)
          removeSelection()
        }}
        onClickCustomCopy={() => {
          dispatch(uiActions.setOpenNotebook(true))

          setPosition(DEFAULT_ANNOTATION_STATE)
          setShowAnnotator(false)

          removeSelection()
        }}
        modalPosition={modalPosition}
        pointPosition={pointPosition}
      />
    </Show>
  )
}

export default AnnotatorRoot
