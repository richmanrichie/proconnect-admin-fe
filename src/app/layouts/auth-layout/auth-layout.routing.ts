import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { ChangePasswordComponent } from '../../pages/change-password/change-password.component';
import { FirstLoginGuard } from '../../guards/first-login.guard';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent },
    { path: 'register',       component: RegisterComponent },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [FirstLoginGuard] }
];
