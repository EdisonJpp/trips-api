import { inject, injectable } from 'inversify'
import { AddressApiClient } from './AddressApiClient'
import { AddressMapper } from './AddressMapper'
import { AddressNotFoundException } from '@/domain/address/exception/AddressNotFoundException'
import { Address } from '@/domain/address/model/Address'
import { IAddressRepository } from '@/domain/address/repository/IAddressRepository'

@injectable()
export class AddressRepository implements IAddressRepository {
  constructor(
    @inject(AddressApiClient) private readonly addressApiClient: AddressApiClient,
    @inject(AddressMapper) private readonly addressMapper: AddressMapper
  ) {}

  async getOneByCoordinate(lon: number, lat: number): Promise<Address> {
    try {
      const addressDto = await this.addressApiClient.getOneByCoordinate(lon, lat)
      return this.addressMapper.toModel(addressDto)
    } catch (error) {
      throw new AddressNotFoundException(`Address not found for coordinate ${lon}, ${lat}`)
    }
  }

  async getAllByCoordinates(condinates: Array<{ lon: number; lat: number }>): Promise<Address[]> {
    const direcctions: Address[] = []

    for (const coordinate of condinates) {
      const address = await this.getOneByCoordinate(coordinate.lon, coordinate.lat)
      direcctions.push(address)
    }

    return direcctions
  }
}
