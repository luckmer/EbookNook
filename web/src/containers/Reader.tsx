import { useNavigate } from 'react-router-dom'

const ReaderRoot = () => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => {
        navigate('/')
      }}>
      ReaderRoot
    </div>
  )
}

export default ReaderRoot
