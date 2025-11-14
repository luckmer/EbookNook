import Home from '@containers/Home'
import Reader from '@containers/Reader'
import { NAVIGATION } from '@interfaces/routes/enums'

export const routes = [
  { path: NAVIGATION.HOME, element: Home },
  { path: NAVIGATION.READER, element: Reader },
]
