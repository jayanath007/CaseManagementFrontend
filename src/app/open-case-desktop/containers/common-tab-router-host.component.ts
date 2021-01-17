import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'dps-common-tab-router-host',
    template: '<router-outlet></router-outlet>'
    ,
    styles: []
})
export class CommonTabRouterHostComponent implements OnInit {

    constructor() {
    }
    ngOnInit() {
    }
}
