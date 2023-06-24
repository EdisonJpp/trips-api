import { BoundingBox } from './BoundingBox'

export class Reading {
  constructor(
    public readonly time: number,
    public readonly speed: number,
    public readonly address: string,
    public readonly speedLimit: number,
    public readonly location: BoundingBox
  ) {}
}

/**
 

{
  time: 1642539928000,
  speed: 10,
  address: "Avenida Apoquindo 291",
  speedLimit: 50,
  location: {
    "lat": -33.580158,
    "lon": -70.567227
  }
}




 */
