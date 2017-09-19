import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Patient } from '../model/patient.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PatientService {
    constructor(private http: Http) {}
    private patientURL = 'api/patient';

    getPatients(): Observable<Patient[]> {
        return this.http.get(this.patientURL)
                        .map((res: Response) => res.json().rows)
                        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    create(patient: Patient): Observable<Patient[]> {
        // let bodyString = JSON.stringify(patient);
        let headers      = new Headers({ 'Content-Type': 'application/json' });
        let options       = new RequestOptions({ headers: headers });

        return this.http.post(this.patientURL, patient, options)
                         .map((res: Response) => res.json())
                         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}

