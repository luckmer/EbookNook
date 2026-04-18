import { AppService } from './appService'

let _api: AppService | undefined

export const getAppClient = (): AppService => {
  if (_api) return _api
  _api = new AppService()

  return _api
}
