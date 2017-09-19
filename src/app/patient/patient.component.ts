import { Component } from '@angular/core';
import { Patient } from './model/patient.model';
import {  PatientMenuComponent } from './index';

@Component({
    selector: 'patient-app',
    template: '<patient-menu></patient-menu>',
    styleUrls: ['./patient.component.css']
})

export class PatientComponent { }
