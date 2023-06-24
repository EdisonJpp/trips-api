import 'reflect-metadata'

import { IAddressDto } from '@/domain/address/client/IResponseDto'
import { AddressApiClient } from '@/infrastructure/address/AddressApiClient'
import { AxiosResponse } from 'axios'
import { mock } from 'jest-mock-extended'

describe('AddressApiClient', () => {
  let addressApiClient: AddressApiClient

  beforeEach(() => {
    addressApiClient = new AddressApiClient()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getOneByCoordinate', () => {
    it('should fetch address by coordinates', async () => {
      const lon = 123.456
      const lat = 78.9
      const expectedResponse = mock<IAddressDto>({
        formatted_address: 'formatted_address',
        geometry: {
          location: {
            lat: 78.9,
            lng: 123.456
          }
        }
      })

      const axiosResponse = mock<AxiosResponse<{ results: IAddressDto[] }>>({
        data: {
          results: [expectedResponse]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      })

      jest.spyOn(addressApiClient.httpClient, 'get').mockResolvedValue(axiosResponse)

      const result = await addressApiClient.getOneByCoordinate(lon, lat)

      expect(addressApiClient.httpClient.get).toHaveBeenCalledWith(expect.stringContaining('/maps/api/geocode/json'))

      expect(result).toEqual(expectedResponse)
    })

    it('should throw an error if the request fails', async () => {
      const lon = 123.456
      const lat = 78.9
      const expectedError = new Error('Request failed')

      jest.spyOn(addressApiClient.httpClient, 'get').mockRejectedValue(expectedError)

      await expect(addressApiClient.getOneByCoordinate(lon, lat)).rejects.toThrow(expectedError)
    })
  })
})
