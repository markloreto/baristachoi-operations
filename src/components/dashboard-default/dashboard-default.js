var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import '../../assets/charts/amchart/amcharts.js';
import '../../assets/charts/amchart/gauge.js';
import '../../assets/charts/amchart/pie.js';
import '../../assets/charts/amchart/serial.js';
import '../../assets/charts/amchart/light.js';
import '../../assets/charts/amchart/ammap.js';
import '../../assets/charts/amchart/worldLow.js';
/**
 * Generated class for the DashboardDefaultComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var DashboardDefaultComponent = /** @class */ (function () {
    function DashboardDefaultComponent() {
        console.log('Hello DashboardDefaultComponent Component');
        this.text = 'Hello World';
    }
    DashboardDefaultComponent.prototype.ngOnInit = function () {
        AmCharts.makeChart('statistics-chart', {
            type: 'serial',
            marginTop: 0,
            hideCredits: true,
            marginRight: 80,
            dataProvider: [{
                    year: 'Jan',
                    value: 0.98
                }, {
                    year: 'Feb',
                    value: 1.87
                }, {
                    year: 'Mar',
                    value: 0.97
                }, {
                    year: 'Apr',
                    value: 1.64
                }, {
                    year: 'May',
                    value: 0.4
                }, {
                    year: 'Jun',
                    value: 2.9
                }, {
                    year: 'Jul',
                    value: 5.2
                }, {
                    year: 'Aug',
                    value: 0.77
                }, {
                    year: 'Sap',
                    value: 3.1
                }],
            valueAxes: [{
                    axisAlpha: 0,
                    dashLength: 6,
                    gridAlpha: 0.1,
                    position: 'left'
                }],
            graphs: [{
                    id: 'g1',
                    bullet: 'round',
                    bulletSize: 9,
                    lineColor: '#4680ff',
                    lineThickness: 2,
                    negativeLineColor: '#4680ff',
                    type: 'smoothedLine',
                    valueField: 'value'
                }],
            chartCursor: {
                cursorAlpha: 0,
                valueLineEnabled: false,
                valueLineBalloonEnabled: true,
                valueLineAlpha: false,
                color: '#fff',
                cursorColor: '#FC6180',
                fullWidth: true
            },
            categoryField: 'year',
            categoryAxis: {
                gridAlpha: 0,
                axisAlpha: 0,
                fillAlpha: 1,
                fillColor: '#FAFAFA',
                minorGridAlpha: 0,
                minorGridEnabled: true
            },
            'export': {
                enabled: true
            }
        });
    };
    DashboardDefaultComponent.prototype.onTaskStatusChange = function (event) {
        var parentNode = (event.target.parentNode.parentNode);
        parentNode.classList.toggle('done-task');
    };
    DashboardDefaultComponent.prototype.getRandomData = function () {
        var data = [];
        var totalPoints = 300;
        if (data.length > 0) {
            data = data.slice(1);
        }
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50;
            var y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            }
            else if (y > 100) {
                y = 100;
            }
            data.push(y);
        }
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]]);
        }
        return res;
    };
    DashboardDefaultComponent = __decorate([
        Component({
            selector: 'dashboard-default',
            templateUrl: 'dashboard-default.html'
        }),
        __metadata("design:paramtypes", [])
    ], DashboardDefaultComponent);
    return DashboardDefaultComponent;
}());
export { DashboardDefaultComponent };
//# sourceMappingURL=dashboard-default.js.map