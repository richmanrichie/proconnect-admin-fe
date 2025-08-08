import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { 
      path: 'organizations',
      loadChildren: () => import('../../pages/organizations/organizations.module')
        .then(m => m.OrganizationsModule)
    },
    {
      path: 'orders',
      loadChildren: () => import('../../pages/orders/orders.module')
        .then(m => m.OrdersModule)
    },
    {
      path: 'settings',
      loadChildren: () => import('../../pages/settings/settings.module')
        .then(m => m.SettingsModule)
    },
    {
      path: 'loans',
      loadChildren: () => import('../../pages/loans/loans.module')
        .then(m => m.LoansModule)
    }
];
