export class TripBoundingBox {
  constructor(public readonly lat: number, public readonly lon: number) {}
}

export class TripReading {
  constructor(
    public readonly time: number,
    public readonly lat: number,
    public readonly lon: number,
    public readonly address: string
  ) {}
}

export class Trip {
  constructor(
    public readonly id: string,
    public readonly distance: number,
    public readonly duration: number,
    public readonly overspeedsCount: number,
    public readonly boundingBox: TripBoundingBox[],
    public readonly start: TripReading,
    public readonly end: TripReading
  ) {}
}
