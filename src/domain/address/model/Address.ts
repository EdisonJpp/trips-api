export class Address {
  constructor(
    public readonly formattedAddress: string,
    public readonly addressComponents: {
      longName: string
      shortName: string
      types: string[]
    }[],
    public readonly geometry: {
      location: {
        lat: number
        lng: number
      }
    }
  ) {}
}
