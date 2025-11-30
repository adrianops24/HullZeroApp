export interface Address {
  addressId: number;
  countryCode: string;
  postalCode: string;
  lineAddress: string;
}

export interface CreateAddress extends Pick<Address, 'countryCode' | 'postalCode' | 'lineAddress'> {}

export interface AddressResponse extends Pick<Address, 'addressId' | 'countryCode' | 'postalCode' | 'lineAddress'> {}
