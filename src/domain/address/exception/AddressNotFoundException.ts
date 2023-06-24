import { AddressException } from './AddressException'

export class AddressNotFoundException extends AddressException {
  constructor(public readonly error: string = 'Address not found') {
    super(error)
  }
}
