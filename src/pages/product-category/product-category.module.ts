import { MyHeaderComponentModule } from './../../components/my-header/my-header.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductCategoryPage } from './product-category';

@NgModule({
  declarations: [
    ProductCategoryPage
  ],
  imports: [
    IonicPageModule.forChild(ProductCategoryPage),
    MyHeaderComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductCategoryPageModule {}
