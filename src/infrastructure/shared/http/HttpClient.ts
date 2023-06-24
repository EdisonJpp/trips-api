import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'
import { injectable } from 'inversify'

@injectable()
export class HttpClient {
  public httpClient!: AxiosInstance

  public init(baseUrl: string, axiosConfig?: CreateAxiosDefaults): void {
    this.httpClient = axios.create({
      baseURL: baseUrl,
      ...(axiosConfig && axiosConfig)
    })
  }
}
