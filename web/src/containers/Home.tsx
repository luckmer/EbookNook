import Home from '@pages/Home'
import { getDocumentLoader } from '../libs/document/index'

const HomeRoot = () => {
  return (
    <Home
      onClick={(file) => {
        const document = getDocumentLoader(file).load()
        console.log('document', document)
      }}
    />
  )
}

export default HomeRoot
