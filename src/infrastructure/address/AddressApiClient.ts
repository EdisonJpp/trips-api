import { injectable } from 'inversify'
import { HttpClient } from '../shared/http/HttpClient'
import { IAddressDto } from '@/domain/address/client/IResponseDto'
import { IAddressApiClient } from '@/domain/address/client/IAddressApiClient'
import config from '@/config'

const url = 'https://maps.googleapis.com'

@injectable()
export class AddressApiClient extends HttpClient implements IAddressApiClient {
  constructor() {
    super()

    this.init(url)
  }

  async getOneByCoordinate(lon: number, lat: number): Promise<IAddressDto> {
    const { data } = await this.httpClient.get<{
      results: IAddressDto[]
    }>(`/maps/api/geocode/json?latlng=${lat},${lon}&key=${config.google_api_key}`)
    return data.results[0]
  }
}
