import Show from '@components/Show'
import Annotator from '@pages/Annotator'

const AnnotatorRoot = () => {
  return (
    <Show when={false}>
      <Annotator
        onClickCopy={() => {}}
        onClickAddNote={() => {}}
        modalPosition={{
          top: `${0}px`,
          left: `${0}px`,
          width: `${100}px`,
          minHeight: `${50}px`,
        }}
        pointPosition={{}}
      />
    </Show>
  )
}

export default AnnotatorRoot
