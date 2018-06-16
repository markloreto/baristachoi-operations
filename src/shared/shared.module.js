var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleFullscreenDirective } from './fullscreen/toggle-fullscreen.directive';
import { AccordionAnchorDirective } from './accordion/accordionanchor.directive';
import { AccordionLinkDirective } from './accordion/accordionlink.directive';
import { AccordionDirective } from './accordion/accordion.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollModule } from './scroll/scroll.module';
import { MenuItems } from './menu-items/menu-items';
import { SpinnerComponent } from './spinner/spinner.component';
import { CardComponent } from './card/card.component';
import { CardRefreshDirective } from './card/card-refresh.directive';
import { CardToggleDirective } from './card/card-toggle.directive';
import { DataFilterPipe } from './element/data-filter.pipe';
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                ScrollModule,
                NgbModule.forRoot()
            ],
            declarations: [
                AccordionAnchorDirective,
                AccordionLinkDirective,
                AccordionDirective,
                ToggleFullscreenDirective,
                CardRefreshDirective,
                CardToggleDirective,
                SpinnerComponent,
                CardComponent,
                DataFilterPipe
            ],
            exports: [
                AccordionAnchorDirective,
                AccordionLinkDirective,
                AccordionDirective,
                ToggleFullscreenDirective,
                CardRefreshDirective,
                CardToggleDirective,
                ScrollModule,
                NgbModule,
                SpinnerComponent,
                CardComponent,
                DataFilterPipe
            ],
            providers: [
                MenuItems
            ]
        })
    ], SharedModule);
    return SharedModule;
}());
export { SharedModule };
//# sourceMappingURL=shared.module.js.map