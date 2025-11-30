import { UserRole } from '../enums/user-role';
import { UserStatus } from '../enums/user-status';
import { AddressResponse } from './address';
import { PhoneNumberResponse } from './phone-number';

export interface UserProfile {
  userId: number;
  fullName: string;
  cpf: string;
  nickname: string;
  birthdate: Date;
  avatarUrl?: string;
}

export interface CreateUserProfile
  extends Pick<UserProfile, 'fullName' | 'cpf' | 'nickname' | 'birthdate' | 'avatarUrl'> {}

export interface UserProfileResponse
  extends Pick<UserProfile, 'userId' | 'fullName' | 'cpf' | 'nickname' | 'birthdate' | 'avatarUrl'> {}

export interface UserCredential {
  userId: number;
  email: string;
  password: string;
  salt: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: Date;
  createdAt: Date;
}

export interface CreateUserCredential extends Pick<UserCredential, 'email' | 'password'> {}

export interface UserCredentialResponse extends Pick<UserCredential, 'userId' | 'email' | 'status'> {}

export interface UserResponse {
  credentials: UserCredentialResponse;
  profile: UserProfileResponse;
  phoneNumbers: PhoneNumberResponse[];
  addresses: AddressResponse[];
}
