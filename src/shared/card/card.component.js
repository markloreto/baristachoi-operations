var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { cardToggle, cardClose } from './card-animation';
var CardComponent = /** @class */ (function () {
    function CardComponent() {
        this.classHeader = false;
        this.cardToggle = 'expanded';
        this.cardClose = 'open';
        this.loadCard = false;
        this.isCardToggled = false;
    }
    CardComponent.prototype.ngOnInit = function () {
    };
    CardComponent.prototype.toggleCard = function (event) {
        this.cardToggle = this.cardToggle === 'collapsed' ? 'expanded' : 'collapsed';
    };
    CardComponent.prototype.closeCard = function (event) {
        this.cardClose = this.cardClose === 'closed' ? 'open' : 'closed';
    };
    CardComponent.prototype.fullScreen = function (event) {
        this.fullCard = this.fullCard === 'full-card' ? '' : 'full-card';
        this.fullCardIcon = this.fullCardIcon === 'icofont-resize' ? '' : 'icofont-resize';
    };
    CardComponent.prototype.cardRefresh = function () {
        var _this = this;
        this.loadCard = true;
        this.cardLoad = 'card-load';
        setTimeout(function () {
            _this.cardLoad = '';
            _this.loadCard = false;
        }, 3000);
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CardComponent.prototype, "headerContent", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CardComponent.prototype, "title", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CardComponent.prototype, "blockClass", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CardComponent.prototype, "cardClass", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], CardComponent.prototype, "classHeader", void 0);
    CardComponent = __decorate([
        Component({
            selector: 'app-card',
            templateUrl: './card.component.html',
            animations: [cardToggle, cardClose],
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [])
    ], CardComponent);
    return CardComponent;
}());
export { CardComponent };
//# sourceMappingURL=card.component.js.map