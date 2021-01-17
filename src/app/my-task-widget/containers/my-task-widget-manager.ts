import { getTasksWidgetIsloading, getTasksWidgetData } from '../reducers';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitMyTaskWidget, CompleteTaskRequest, RefreshMyTaskWidget } from '../actions/core';
import { BtnOption } from '../models/enumeration';
import { GridData } from '../../case-task-core/models/interface';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { MainMenuService, NavigateToView } from '../../layout-desktop';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';


@Component({
    selector: 'dps-my-task-widget-manager',
    template: `<dps-my-task-widget-layout
    [isLoading] = "isLoading$ | async"
    [data] = "data$ | async"
    [layout]="layout"
    (clickOptionBtn)="onOptionBtnClick($event)"
    (myTaskView)="openMyTaskView()"
    (removeWidget)="onRemoveWidget()"
    (refreshData)="onRefreshMyTaskWidget()"
    >
  </dps-my-task-widget-layout>`,
})
export class MyTaskWidgetManagerComponent implements OnInit {

    isLoading$: any;
    data$: any;
    @Input() layout: number;
    @Output() removeWidget = new EventEmitter();

    constructor(protected store: Store<any>, private pageService: MainMenuService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.store.dispatch(new InitMyTaskWidget());
        this.isLoading$ = this.store.select(getTasksWidgetIsloading());
        this.data$ = this.store.select(getTasksWidgetData());
    }

    onOptionBtnClick(value: { option: BtnOption, item: GridData }) {
        switch (value.option) {
            case BtnOption.Compltete: {
                this.store.dispatch(new CompleteTaskRequest({ row: value.item }));
                break;
            }
            case BtnOption.OpenCase: {
                const materData: GridRowItemWrapper = {
                    data: {
                        appID: value.item.appID,
                        fileID: value.item.fileID,
                        app_Code: value.item.appCode,
                        branchID: value.item.branchID,
                        feeEarner: value.item.putOnBy,
                        reviewDate: value.item.datedn,
                        clientName: value.item.client,
                        reviewNote: value.item.note,
                        company_Name: '',
                        matterDetails: value.item.matterDetails,
                        matterReferenceNo: value.item.matterReferenceNo,
                        matterCounter: value.item.matterCounter,
                        ufnValue: value.item.ufnValue,
                        eBilling: value.item.eBilling,
                        isPlotMatter: value.item.isPlotMatter,
                        isPlotMasterMatter: value.item.isPlotMasterMatter,
                        isProspectMatter: value.item.isProspectMatter,
                        isLegalAid: value.item.isLegalAid
                    }
                };
                this.pageService.gotoOpenCase(materData);
                break;
            }
        }

    }

    openMyTaskView() {
        this.store.dispatch(new NavigateToView('my_tasks', this.route.parent));
    }

    onRemoveWidget() {
        this.removeWidget.emit();
    }

    onRefreshMyTaskWidget() {
        this.store.dispatch(new RefreshMyTaskWidget());
    }

}
