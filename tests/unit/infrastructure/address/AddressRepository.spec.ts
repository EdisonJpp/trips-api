import 'reflect-metadata'

import { AddressNotFoundException } from '@/domain/address/exception/AddressNotFoundException'
import { Address } from '@/domain/address/model/Address'
import { IAddressRepository } from '@/domain/address/repository/IAddressRepository'
import { IAddressDto } from '@/domain/address/client/IResponseDto'
import { mock } from 'jest-mock-extended'
import { AddressApiClient } from '@/infrastructure/address/AddressApiClient'
import { AddressMapper } from '@/infrastructure/address/AddressMapper'
import { AddressRepository } from '@/infrastructure/address/AddressRepository'

describe('AddressRepository', () => {
  let addressRepository: IAddressRepository
  let addressApiClientMock: jest.Mocked<AddressApiClient>
  let addressMapperMock: jest.Mocked<AddressMapper>

  beforeEach(() => {
    addressApiClientMock = mock<AddressApiClient>()
    addressMapperMock = mock<AddressMapper>()
    addressRepository = new AddressRepository(addressApiClientMock, addressMapperMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getOneByCoordinate', () => {
    it('should return the address for a given coordinate', async () => {
      const lon = 123.456
      const lat = 78.9
      const addressDto: IAddressDto = mock<IAddressDto>({})
      const expectedAddress: Address = mock<Address>({})

      addressApiClientMock.getOneByCoordinate.mockResolvedValue(addressDto)
      addressMapperMock.toModel.mockReturnValue(expectedAddress)

      const result = await addressRepository.getOneByCoordinate(lon, lat)

      expect(addressApiClientMock.getOneByCoordinate).toHaveBeenCalledWith(lon, lat)
      expect(addressMapperMock.toModel).toHaveBeenCalledWith(addressDto)
      expect(result).toEqual(expectedAddress)
    })

    it('should throw AddressNotFoundException if address is not found', async () => {
      const lon = 123.456
      const lat = 78.9
      const expectedError = new AddressNotFoundException(`Address not found for coordinate ${lon}, ${lat}`)

      addressApiClientMock.getOneByCoordinate.mockRejectedValue(new Error('Address not found'))

      await expect(addressRepository.getOneByCoordinate(lon, lat)).rejects.toThrow(expectedError)
    })
  })

  describe('getAllByCoordinates', () => {
    it('should return an array of addresses for given coordinates', async () => {
      const coordinates = [
        { lon: 123.456, lat: 78.9 },
        { lon: 12.345, lat: 67.8 }
      ]

      const addressDto1 = mock<IAddressDto>({})
      const addressDto2 = mock<IAddressDto>({})

      const expectedAddress1: Address = mock<Address>()
      const expectedAddress2: Address = mock<Address>()
      const expectedAddresses: Address[] = [expectedAddress1, expectedAddress2]

      addressApiClientMock.getOneByCoordinate.mockResolvedValueOnce(addressDto1).mockResolvedValueOnce(addressDto2)
      addressMapperMock.toModel.mockReturnValueOnce(expectedAddress1).mockReturnValueOnce(expectedAddress2)

      const result = await addressRepository.getAllByCoordinates(coordinates)

      expect(addressApiClientMock.getOneByCoordinate).toHaveBeenCalledTimes(2)
      expect(addressApiClientMock.getOneByCoordinate).toHaveBeenCalledWith(coordinates[0].lon, coordinates[0].lat)
      expect(addressApiClientMock.getOneByCoordinate).toHaveBeenCalledWith(coordinates[1].lon, coordinates[1].lat)
      expect(addressMapperMock.toModel).toHaveBeenCalledTimes(2)
      expect(addressMapperMock.toModel).toHaveBeenCalledWith(addressDto1)
      expect(addressMapperMock.toModel).toHaveBeenCalledWith(addressDto2)
      expect(result).toEqual(expectedAddresses)
    })

    it('should throw AddressNotFoundException if address is not found', async () => {
      const coordinates = [
        { lon: 123.456, lat: 78.9 },
        { lon: 12.345, lat: 67.8 }
      ]
      const expectedError = new AddressNotFoundException(
        `Address not found for coordinate ${coordinates[0].lon}, ${coordinates[0].lat}`
      )

      addressApiClientMock.getOneByCoordinate.mockRejectedValue(new Error('Address not found'))

      await expect(addressRepository.getAllByCoordinates(coordinates)).rejects.toThrow(expectedError)
    })
  })
})
