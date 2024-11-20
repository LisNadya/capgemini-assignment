export interface EmailOTPData {
  otpValue: number;
  numberTries: number;
  dateTimeCreated: Date;
}

export interface HttpResponse {
  status: number;
  message: string;
}
