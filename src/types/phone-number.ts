import { PhoneNumberType } from '../enums/phone-number';

export interface PhoneNumber {
  phoneNumberId: number;
  countryCode: string;
  number: string;
  type: PhoneNumberType;
}

export interface CreatePhoneNumber extends Pick<PhoneNumber, 'countryCode' | 'number' | 'type'> {}

export interface PhoneNumberResponse extends Pick<PhoneNumber, 'phoneNumberId' | 'countryCode' | 'number' | 'type'> {}
