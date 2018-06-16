
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartupPage } from './startup';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';
import { ArchwizardModule } from 'angular-archwizard';


@NgModule({
  declarations: [
    StartupPage
  ],
  imports: [
    IonicPageModule.forChild(StartupPage),
    MyHeaderComponentModule,
    ArchwizardModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StartupPageModule {}
