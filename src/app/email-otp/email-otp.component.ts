import { Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { EmailOtpService } from './services/email-otp.service';
import { filter, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-email-otp',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
  ],
  templateUrl: './email-otp.component.html',
  styleUrl: './email-otp.component.css',
})
export class EmailOtpComponent {
  hasSentEmail: boolean = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  otp = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{6}$/),
  ]);

  constructor(private emailOtpService: EmailOtpService) {}

  /**
   * generateOTPEmail - generate the OTP by calling generateOTPEmail method
   */
  generateOTPEmail(): void {
    // if the email is not valid - don't proceed
    // **testing - check against the scenarios that fulfill this condition, expect emailOtpService.generateOTPEmail will not be called 
    if (!this.email.valid) return;

    // else - call the generate otp email method
    // **testing - expect emailOtpService.generateOTPEmail will be called 
    // **testing - by mocking different responses, validate if the state of the properties are as expected
    this.emailOtpService
      .generateOTPEmail(this.email.value)
      .pipe(
        take(1),
        filter((data) => !!data)
      )
      .subscribe(({ status, message }) => {
        // if status is 200 - set hasSentEmail to true 
        this.hasSentEmail = status === 200;

        if (this.hasSentEmail) return;

        // else - show as inline error
        this.email.setErrors({ postSubmitError: message });
      });
  }

  /**
   * verifyOTP - verify the otp by calling the checkOTP method
   */
  verifyOTP(): void {
    // if the otp is not valid or email has no value - don't proceed
    // **testing - check against the scenarios that fulfill this condition, expect emailOtpService.checkOTP will not be called 
    if (!this.otp.valid || !this.email.value) return;

    // else - call check otp method
    // **testing - expect emailOtpService.checkOTP will be called 
    // **testing - by mocking different responses, validate if the state of the properties are as expected
    this.emailOtpService
      .checkOTP(this.email.value, Number(this.otp.value))
      .pipe(
        take(1),
        filter((data) => !!data)
      )
      .subscribe(({ status, message }) => {
        // if status is 422 - show message as inline error
        if (status === 422) {
          this.otp.setErrors({ postSubmitError: message });
          return;
        }

        // else - show the message as an alert
        const userMessage = status === 200 ? 'Yay, success!!' : message;
        window.alert(userMessage);
        this.resetForm();
      });
  }

  /**
   * resetForm - reset the form state, this is so user can be routed back to the first step - filling in the email
   */
  private resetForm(): void {
    this.hasSentEmail = false;
    this.otp.reset();
    this.email.reset();
  }
}
