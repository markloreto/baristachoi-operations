import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin/admin';
import { BreadBreadcrumbsComponent } from './bread-breadcrumbs/bread-breadcrumbs';
import { TitleComponent } from './title/title';
import { AuthComponent } from './auth/auth';
import { CommonModule } from "@angular/common"


@NgModule({
	declarations: [AdminComponent,
    BreadBreadcrumbsComponent,
    TitleComponent,
    AuthComponent
    ],
	imports: [CommonModule, IonicModule],
	exports: [AdminComponent,
    BreadBreadcrumbsComponent,
    TitleComponent,
    AuthComponent
    ]
})
export class ComponentsModule {}
