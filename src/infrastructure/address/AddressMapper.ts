import { IAddressDto } from '@/domain/address/client/IResponseDto'
import { IAddressMapper } from '@/domain/address/mapper/IAddressMapper'
import { Address } from '@/domain/address/model/Address'
import { injectable } from 'inversify'

@injectable()
export class AddressMapper implements IAddressMapper {
  toModel(dto: IAddressDto): Address {
    return new Address(
      dto.formatted_address,
      dto.address_components.map((item) => ({
        longName: item.long_name,
        shortName: item.short_name,
        types: item.types
      })),
      dto.geometry
    )
  }
}
