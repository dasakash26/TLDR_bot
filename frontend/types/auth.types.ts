export interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

export interface OtpVerifyData {
  email: string;
  otp: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResendOtpData {
  email: string;
}
