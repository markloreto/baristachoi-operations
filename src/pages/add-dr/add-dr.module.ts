import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDrPage } from './add-dr';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    AddDrPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDrPage),
    MyHeaderComponentModule,
    NgxDatatableModule
  ]
})
export class AddDrPageModule {}
