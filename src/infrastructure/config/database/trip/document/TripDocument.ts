export class ReadingDocument {
  constructor(
    public readonly time: number,
    public readonly speed: number,
    public readonly address: string,
    public readonly speedLimit: number,
    public readonly location: { lon: number; lat: number }
  ) {}
}

export class TripDocument {
  constructor(public readonly distance: number, public readonly readings: ReadingDocument[]) {}
}
