import { SyncComponent } from './sync';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {ProgressBarModule} from "angular-progress-bar"

@NgModule({
  declarations: [SyncComponent],
  imports: [IonicModule, ProgressBarModule],
  exports: [SyncComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SyncComponentModule { }
