import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { PatientComponent, PatientEditComponent, PatientListComponent, PatientMenuComponent } from './index';
import { AngularMaterialModule } from '../angular.material.module';

import {Routes, RouterModule} from '@angular/router';
import { patientRoutes } from './patient.routes';


@NgModule({
    imports:      [ BrowserModule, FormsModule, AngularMaterialModule, HttpModule, patientRoutes ],
    exports: [ PatientComponent ],
    declarations: [  PatientComponent, PatientMenuComponent, PatientEditComponent, PatientListComponent]
})

export class PatientModule { }
