import { IAddressDto } from './IResponseDto'

export interface IAddressApiClient {
  getOneByCoordinate(log: number, lat: number): Promise<IAddressDto>
}
