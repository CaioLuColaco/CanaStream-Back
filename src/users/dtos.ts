export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}

export interface UpdateUserDTO {
  email?: string;
  username?: string;
  newPassword?: string;
  currentPassword?: string;
}
