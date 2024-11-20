import { Routes } from '@angular/router';
import { EmailOtpComponent } from './email-otp/email-otp.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
  {
    path: 'login',
    component: EmailOtpComponent,
  },
];
