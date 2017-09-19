import { NgModule } from '@angular/core';
import {MdButtonModule, MdCheckboxModule, MdInputModule, MdRadioModule, MdListModule} from '@angular/material';

@NgModule({
  imports: [MdButtonModule, MdCheckboxModule, MdInputModule, MdRadioModule, MdListModule],
  exports: [MdButtonModule, MdCheckboxModule, MdInputModule, MdRadioModule, MdListModule],
})
export class AngularMaterialModule { }