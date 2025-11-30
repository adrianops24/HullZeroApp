import { CreateAddress } from './address';
import { CreatePhoneNumber } from './phone-number';
import { CreateUserCredential, CreateUserProfile, UserCredential } from './user';

export interface LoginRequest extends Pick<UserCredential, 'email' | 'password'> {}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterRequest {
  credentials: CreateUserCredential;
  profile: CreateUserProfile;
  phoneNumbers: CreatePhoneNumber[];
  addresses: CreateAddress[];
}
