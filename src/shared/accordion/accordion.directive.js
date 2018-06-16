var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive } from '@angular/core';
import 'rxjs/add/operator/filter';
var AccordionDirective = /** @class */ (function () {
    function AccordionDirective() {
        this.navlinks = [];
        this.countState = 1;
    }
    AccordionDirective.prototype.closeOtherLinks = function (openLink) {
        this.countState++;
        if ((openLink.group !== 'sub-toggled' || openLink.group !== 'main-toggled') && this.countState === 1) {
            if (window.innerWidth < 768 || (window.innerWidth >= 768 && window.innerWidth <= 1024)) {
                var toggled_element = document.querySelector('#mobile-collapse');
                toggled_element.click();
            }
        }
        this.navlinks.forEach(function (link) {
            if (link !== openLink && (link.group === 'sub-toggled' || openLink.group !== 'sub-toggled')) {
                link.open = false;
            }
        });
    };
    AccordionDirective.prototype.addLink = function (link) {
        this.navlinks.push(link);
    };
    AccordionDirective.prototype.removeGroup = function (link) {
        var index = this.navlinks.indexOf(link);
        if (index !== -1) {
            this.navlinks.splice(index, 1);
        }
    };
    AccordionDirective.prototype.getUrl = function () {
    };
    AccordionDirective.prototype.ngOnInit = function () {
    };
    AccordionDirective = __decorate([
        Directive({
            selector: '[appAccordion]',
        }),
        __metadata("design:paramtypes", [])
    ], AccordionDirective);
    return AccordionDirective;
}());
export { AccordionDirective };
//# sourceMappingURL=accordion.directive.js.map