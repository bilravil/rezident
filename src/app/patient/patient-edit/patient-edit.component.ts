import { Component } from '@angular/core';
import { Patient } from '../model/patient.model';
import { PatientService } from '../service/patient.service';

@Component({
    selector: 'patient-edit',
    templateUrl: './patient-edit.component.html',
    styleUrls: ['../patient.component.css'],
    providers: [PatientService]
})

export class PatientEditComponent {

    constructor( private patientService: PatientService) {

    }

    items: Patient[] = [];
    addItem(first: string, last: string, middle: string, sex: number): void {
        let patient = new Patient(first, last, middle, sex);
        this.patientService.create(patient).subscribe((data) => console.log(data));
    }

}
