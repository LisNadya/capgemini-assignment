import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { emailStatus, otpStatus } from '../constants/email-otp.constants';
import { EmailOTPData, HttpResponse } from '../models/email-otp.model';

@Injectable({
  providedIn: 'root',
})
/***
 * EmailOtpService - email otp service
 * the code implemented is to simulate an api call performed to a backend server
 */
export class EmailOtpService {
  private readonly validDomain: string = '.dso.org.sg';
  private emailOtpData = new Map<string, EmailOTPData>();

  /**
   * generateOTPEmail - to generate the otp based on the email provided by the user
   * @param emailAddress - email address based on user input
   * @returns status code and message body
   */
  generateOTPEmail(emailAddress: string | null): Observable<HttpResponse> {
    // NEGATIVE SCENARIO #1: if no email address is passed - return STATUS_EMAIL_INVALID
    // **testing - prepare data where email is falsy, validate against response 
    if (!emailAddress)
      return this.response(422, emailStatus.STATUS_EMAIL_INVALID);

    // NEGATIVE SCENARIO #2: if the domain is not valid - return STATUS_EMAIL_FAIL
    // **testing - prepare data where the domain is not the valid domain, validate against response 
    const emailList = emailAddress ? emailAddress.split('@') : [];
    if (!emailList[emailList.length - 1]?.includes(this.validDomain))
      return this.response(422, emailStatus.STATUS_EMAIL_FAIL);

    // POSITIVE SCENARIO: generate otp and send the email - return STATUS_EMAIL_OK
    // **testing - prepare valid email address data
    // **testing - would check if the otp value sent in message body and set in emailOtpData is the same
    // **testing - would check if send email was called
    // **testing - validate against response
    const otpValue = Math.floor(100000 + Math.random() * 900000);
    const messageBody = `Your OTP code is ${otpValue}. The code is valid for 1 minute.`;
    this.sendEmail(emailAddress, messageBody);
    this.emailOtpData.set(emailAddress, {
      otpValue,
      numberTries: 1,
      dateTimeCreated: new Date(),
    });

    return this.response(200, emailStatus.STATUS_EMAIL_OK);
  }

  /**
   * checkOTP - to validate the otp based on the
   * @param emailAddress - email address based on user input
   * @returns status code and message body
   */
  checkOTP(emailAddress: string, otpValue: number): Observable<HttpResponse> {
    const data: EmailOTPData | undefined = this.emailOtpData.get(emailAddress);

    // NEGATIVE SCENARIO #1: if the no data is found based on the email - return STATUS_EMAIL_INVALID
    if (!data) {
      return of({ status: 422, message: otpStatus.STATUS_EMAIL_INVALID });
    }

    // NEGATIVE SCENARIO #2: if the time exceeds 1 minute - return STATUS_OTP_TIMEOUT
    // **testing - would prepare emailOtpData to have dateTimeCreated to be new Date() + more than 1 min ago
    // **testing - check if the email is removed from emailOtpData
    // **testing - validate against response
    if (this.isExceedTimeLimit(data)) {
      this.clear(emailAddress);
      return this.response(408, otpStatus.STATUS_OTP_TIMEOUT);
    }

    // NEGATIVE SCENARIO #3: if the number of tries is more than 10 - return STATUS_OTP_FAIL
    // **testing - loop through more than 10 times to pass an otp param value which doesn't match against the otp that exists in emailOtpData
    // **testing - check if the email is removed from emailOtpData
    // **testing - validate against response
    if (this.isExceedNumberTries(data)) {
      this.clear(emailAddress);
      return this.response(429, otpStatus.STATUS_OTP_FAIL);
    }

    // NEGATIVE SCENARIO #4: if the input otp does not match the generate otp - return STATUS_OTP_INVALID
    // **testing - pass the otp param value which doesn't match against the otp that exists in emailOtpData
    // **testing - validate against response
    if (otpValue !== data.otpValue) {
      this.emailOtpData.set(emailAddress, {
        ...data,
        numberTries: data.numberTries + 1,
      });
      return this.response(422, otpStatus.STATUS_OTP_INVALID);
    }

    // POSITIVE SCENARIO: if input otp matches generated otp - return STATUS_OTP_OK
    // **testing - prepare valid email address data
    // **testing - check if the email is cleared from emailOtpData
    // **testing - validate against response
    this.clear(emailAddress);
    return this.response(200, otpStatus.STATUS_OTP_OK);
  }

  /**
   * sendEmail - to simulate a sendEmail feature
   * @param _emailAddress
   * @param emailBody
   */
  private sendEmail(_emailAddress: string, emailBody: string): void {
    // assuming the sending of email function is implemented here

    // the window alert is simply to show the otp generated (for testing purpose)
    window.alert(emailBody);
  }

  /**
   * clear - clear the email data stored
   * @param emailAddress - email address based on user input
   */
  private clear(emailAddress: string): void {
    this.emailOtpData.delete(emailAddress);
  }

  /**
   * isExceedTimeLimit - to check if the time limit has been exceeded more than 1 minute
   * @param param0 dateTimeCreated - the date time where the otp was generated
   * @returns true if it has been more than 1 minute from the date time where the otp was generated
   */
  private isExceedTimeLimit = ({ dateTimeCreated }: EmailOTPData): boolean =>
    new Date().getTime() >
    dateTimeCreated.setMinutes(dateTimeCreated.getMinutes() + 1);

  /**
   * isExceedNumberTries - to check if the number of tries has exceeded more than 10
   * @param param0 numberTries - the number of tries that has been performed
   * @returns true if it has been more than 1 minute from the date time where the otp was generated
   */
  private isExceedNumberTries = ({ numberTries }: EmailOTPData): boolean =>
    numberTries > 10;

  /**
   * response - to return the response body format
   * @param status - status of response
   * @param message - message of response
   * @returns HttpResponse
   */
  private response = (
    status: number,
    message: string
  ): Observable<HttpResponse> => of({ status, message });
}
