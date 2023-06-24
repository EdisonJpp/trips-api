import 'reflect-metadata'

import { IAddressDto } from '@/domain/address/client/IResponseDto'
import { Address } from '@/domain/address/model/Address'
import { AddressMapper } from '@/infrastructure/address/AddressMapper'
import { mock } from 'jest-mock-extended'

describe('AddressMapper', () => {
  let addressMapper: AddressMapper

  beforeEach(() => {
    addressMapper = new AddressMapper()
  })

  describe('toModel', () => {
    it('should map IAddressDto to Address model', () => {
      const dto = mock<IAddressDto>({
        formatted_address: '123 Main St',
        address_components: [
          {
            long_name: '123',
            short_name: '123',
            types: ['street_number']
          },
          {
            long_name: 'Main St',
            short_name: 'Main St',
            types: ['route']
          }
        ],
        geometry: {
          location: {
            lat: 123.456,
            lng: 78.9
          }
        }
      })

      const result = addressMapper.toModel(dto)

      expect(result).toBeInstanceOf(Address)

      expect(dto.formatted_address).toEqual(result.formattedAddress)

      expect(dto.address_components[0].long_name).toEqual(result.addressComponents[0].longName)
      expect(dto.address_components[0].short_name).toEqual(result.addressComponents[0].shortName)

      expect(dto.geometry.location.lat).toEqual(result.geometry.location.lat)
      expect(dto.geometry.location.lng).toEqual(result.geometry.location.lng)
    })
  })
})
