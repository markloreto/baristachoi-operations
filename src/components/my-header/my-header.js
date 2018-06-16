var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from '@angular/core';
/**
 * Generated class for the MyHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var MyHeaderComponent = /** @class */ (function () {
    function MyHeaderComponent() {
        this.menuEnable = true;
        this.title = "";
        this.headerColor = "primary";
        this.btn1 = { enable: false, title: "", color: "secondary", icon: "options" };
        this.btn2 = { enable: false, title: "", color: "secondary", icon: "options" };
        this.btn1OnPush = new EventEmitter();
        this.btn2OnPush = new EventEmitter();
        this.btn1Attr = "";
        console.log('Hello MyHeaderComponent Component');
    }
    MyHeaderComponent.prototype.button1Click = function () {
        this.btn1OnPush.emit();
    };
    MyHeaderComponent.prototype.button2Click = function () {
        this.btn2OnPush.emit();
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MyHeaderComponent.prototype, "menuEnable", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MyHeaderComponent.prototype, "title", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MyHeaderComponent.prototype, "headerColor", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MyHeaderComponent.prototype, "btn1", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MyHeaderComponent.prototype, "btn2", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MyHeaderComponent.prototype, "btn1OnPush", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MyHeaderComponent.prototype, "btn2OnPush", void 0);
    MyHeaderComponent = __decorate([
        Component({
            selector: 'my-header',
            templateUrl: 'my-header.html'
        }),
        __metadata("design:paramtypes", [])
    ], MyHeaderComponent);
    return MyHeaderComponent;
}());
export { MyHeaderComponent };
//# sourceMappingURL=my-header.js.map