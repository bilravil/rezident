import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular.material.module';
import { PatientModule } from './patient/patient.module';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

@NgModule({
    imports:      [ BrowserModule, FormsModule , BrowserAnimationsModule, AngularMaterialModule, PatientModule, routes],
    declarations: [ AppComponent ],
    bootstrap:    [ AppComponent ]
})
export class AppModule {}
