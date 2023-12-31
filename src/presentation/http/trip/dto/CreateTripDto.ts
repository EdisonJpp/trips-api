import { Type } from 'class-transformer'
import { IsNumber, ValidateNested, ArrayNotEmpty, ArrayMinSize, IsNotEmpty } from 'class-validator'

export class BoundingBoxDto {
  @IsNumber()
  @IsNotEmpty()
  lat?: number

  @IsNumber()
  @IsNotEmpty()
  lon?: number
}

export class ReadingDto {
  @IsNumber()
  @IsNotEmpty()
  time?: number

  @IsNumber()
  @IsNotEmpty()
  speed?: number

  @IsNumber()
  @IsNotEmpty()
  speedLimit?: number

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BoundingBoxDto)
  location?: BoundingBoxDto
}

export class CreateTripDto {
  @ArrayNotEmpty()
  @ArrayMinSize(5)
  @ValidateNested({ each: true })
  @Type(() => ReadingDto)
  readings?: ReadingDto[]
}
