import { Address } from '../model/Address'

export interface IAddressRepository {
  getOneByCoordinate(log: number, lat: number): Promise<Address>
  getAllByCoordinates(
    condinates: Array<{
      lon: number
      lat: number
    }>
  ): Promise<Address[]>
}
