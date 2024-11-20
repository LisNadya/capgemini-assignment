export const emailStatus = {
    STATUS_EMAIL_OK: 'Email containing OTP has been sent successfully',
    STATUS_EMAIL_FAIL: 'Email does not exist or sending to the email has failed',
    STATUS_EMAIL_INVALID: 'Email is invalid'
}

export const otpStatus = {
    STATUS_OTP_OK: 'OTP is valid and checked',
    STATUS_EMAIL_INVALID: 'Email is invalid',
    STATUS_OTP_INVALID: 'OTP is invalid',
    STATUS_OTP_FAIL: 'OTP is wrong after 10 tries',
    STATUS_OTP_TIMEOUT: 'Timeout after 1 min'
}