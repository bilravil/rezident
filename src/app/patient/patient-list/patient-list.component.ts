import { Component, OnInit } from '@angular/core';
import { Patient } from '../model/patient.model';
import { PatientService } from '../service/patient.service';

@Component({
    selector: 'patient-list',
    templateUrl: './patient-list.component.html',
    styleUrls: ['../patient.component.css'],
    providers: [PatientService]
})

export class PatientListComponent implements OnInit {
    patients: Patient[];

    constructor(private patientService: PatientService) { }

    getPatients(): void {
        this.patientService.getPatients().subscribe((data) => this.patients = data);
    }

    ngOnInit() {
        this.getPatients();
    }
}
