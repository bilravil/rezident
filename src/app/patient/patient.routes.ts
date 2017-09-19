import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientComponent, PatientEditComponent, PatientListComponent } from './index';

export const router: Routes = [
    {
        path: 'patient',
        component: PatientComponent,
        children: [
            { path: 'edit', component:  PatientEditComponent},
            { path: 'list', component:  PatientListComponent},
        ]
    }
];

export const patientRoutes: ModuleWithProviders = RouterModule.forChild(router);
