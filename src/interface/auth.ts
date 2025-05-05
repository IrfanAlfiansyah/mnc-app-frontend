export interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
  agreeTerms: boolean;
}
