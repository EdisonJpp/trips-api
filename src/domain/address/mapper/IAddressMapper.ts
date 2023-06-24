import { IAddressDto } from '../client/IResponseDto'
import { Address } from '../model/Address'

export interface IAddressMapper {
  toModel(addressDto: IAddressDto): Address
}
