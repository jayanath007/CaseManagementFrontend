import { InforDialogData } from './../../../shared/models/dialog';
import { ScreenLogicDocuments } from './../../../screen-desingner-core/models/screen-desingner-request';

import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { emit } from 'cluster';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
    ScreenListItemsChangeKind, RowOvItemChangeKind, RowScreenDefinitionChangeKind,
    ViewChangeKind,
} from '../../../screen-desingner-core/actions/core';
import { OvItem } from '../../../screen-desingner-core/models/application-component';
import { FormViewRequestViewModel } from '../../../screen-view-core/models/request';
import { ConfirmDialogData, ConfirmDialogResultKind, InforDialogComponent } from '../../../shared';

@Component({
    selector: 'dps-screen-desingner',
    templateUrl: './screen-desingner.component.html',
    styleUrls: ['./screen-desingner.component.scss']
})


export class ScreenDesingnerComponent implements OnInit, OnChanges {

    @Input()
    formView;

    @Input()
    ovItemList;

    @Input()
    screenDesingner;

    @Input()
    screenDesingnerState;

    @Input()
    masageCount;


    @Input()
    lookupFiles;

    @Input()
    selectedContanerComponent;

    @Input()
    screenComponentList;

    @Input()
    selectedOvItem;

    @Input()
    searchText;

    @Input()
    activeTab;

    @Input()
    screenLogicDocuments;

    @Input()
    checkedOutScreenLogicDocuments: Array<ScreenLogicDocuments>;

    @Input()
    closePopup;


    @Output()
    onViewChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
    @Output()
    onComponentChange = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenContanerComponent, value: any }>();
    @Output()
    onOvChange = new EventEmitter<{ kind: RowOvItemChangeKind, row: OvItem, value: any }>();
    @Output()
    onGetlookUpData = new EventEmitter<{ payload: { appId: number } }>();
    @Output()
    onScreenDefinitionChange = new EventEmitter<{ kind: RowScreenDefinitionChangeKind, row: ScreenDefinition, value: any }>();
    @Output()
    onSave = new EventEmitter<{ importXMLPath: string, rearrange: boolean }>();
    @Output()
    onSearchTextChange = new EventEmitter<{ value: string }>();

    @Output()
    onLogicDodumentView = new EventEmitter<{ appId: number, fileName: string }>();
    @Output()
    onTabChange = new EventEmitter<Number>();

    @Output()
    onExportOvList = new EventEmitter<{
        appID: number, screenNumber: number,
        selectedVar: number, filter: string, orderBySquence: boolean
    }>();

    @Output()
    onExportXMLList = new EventEmitter<{
        appID: number, screenNumber: number,
        selectedVar: number, filter: string, orderBySquence: boolean
    }>();

    @Output()
    onCreateLookup = new EventEmitter<{ row: ScreenContanerComponent, value: any }>();


    @Output()
    onDiscardCheckin = new EventEmitter<any>();

    @Output()
    onCheckin = new EventEmitter<any>();

    @Output()
    onCloseScreenDesigner = new EventEmitter<any>();



    leftCollapse = false;
    rightCollapse = false;


    constructor(private dialogRef: MatDialogRef<ScreenDesingnerComponent>,
        private dialog: MatDialog) {


        // closePopup
    }
    ngOnInit() {
    }
    ngOnChanges(changers: SimpleChanges) {

        if (changers.closePopup && !changers.closePopup.isFirstChange() && changers.closePopup.currentValue) {
            this.dialogRef.close();
        }
    }


    doCheckin(item) {
        this.onCheckin.emit(item);
    }

    doDiscardCheckin(item) {
        this.onDiscardCheckin.emit(item);
    }


    exportOvList(event) {
        this.onExportOvList.emit(event);
    }

    exportXMLList(event) {
        this.onExportXMLList.emit(event);
    }

    createLookup(event) {
        this.onCreateLookup.emit(event);
    }


    logicDodumentViewOpen(event) {
        this.onLogicDodumentView.emit(event);
    }

    leftCollapseMenu() {
        this.leftCollapse = !this.leftCollapse;
    }

    rightCollapseMenu() {
        this.rightCollapse = !this.rightCollapse;
    }


    getlookUpData(event) {
        this.onGetlookUpData.emit(event);
    }

    onItemChange(event) {
        this.onComponentChange.emit(event);
    }

    onScreenTitleChange(event) {
        this.onScreenDefinitionChange.emit(event);
    }
    onDrop({ event, dragData, dragDataType }) {
        event.preventDefault();
        const dragItem: OvItem = dragData;

        if (!dragItem.onScreen) {

            dragItem.screenComponentDto.sC_Left = event.offsetX - 10;
            dragItem.screenComponentDto.sC_Top = event.offsetY - 10;
            this.onComponentChange.emit({
                kind: ScreenListItemsChangeKind.AddItem, row: null,
                value: dragItem.screenComponentDto,
            });
        }
        // this.onDropItem.emit({ dragItem: dragData, dropContenerItem: dropContenerItem });
    }


    ovChange(event) {
        this.onOvChange.emit(event);
    }

    searchTextChange(value) {
        this.onSearchTextChange.emit(value);
    }


    closeDialog() {

        this.onCloseScreenDesigner.emit();

        // if (this.checkedOutScreenLogicDocuments.length > 0) {

        //     const message = 'Please Check-in or Abort file changes';
        //     const dialogData: InforDialogData = {
        //         content: {
        //             title: 'Screen Designer',
        //             message: message
        //         },
        //         data: { messageType: 'alert' }
        //     };

        //     const confirmDialogRef = this.dialog.open(InforDialogComponent, {
        //         data: dialogData,
        //         disableClose: true,
        //         width: '350px',
        //         panelClass: 'dps-notification'
        //     });

        // } else if (this.formView && this.formView.isFormViewChanged === true) {

        //     const message = 'Save Screen Design?';

        //     const dialogData: ConfirmDialogData = {
        //         content: {
        //             title: 'Screen Designer',
        //             message: message,
        //             acceptLabel: 'OK',
        //             rejectLabel: 'No'
        //         },
        //         data: null
        //     };
        //     const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        //         data: dialogData,
        //         disableClose: true,
        //         width: '350px',
        //         panelClass: 'dps-notification'
        //     });
        //     confirmDialogRef.afterClosed().subscribe(dialogResult => {
        //         if (dialogResult && dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
        //             this.massageReOrder();
        //         } else {
        //             this.dialogRef.close();
        //         }

        //     });

        // } else {
        //     this.dialogRef.close();
        // }
    }

    // massageReOrder() {
    //     const message = 'Do you want to rearrange control sequence according to their position?';

    //     const dialogData: ConfirmDialogData = {
    //         content: {
    //             title: 'Screen Designer',
    //             message: message,
    //             acceptLabel: 'OK',
    //             rejectLabel: 'No'
    //         },
    //         data: null
    //     };
    //     const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
    //         data: dialogData,
    //         disableClose: true,
    //         width: '350px',
    //         panelClass: 'dps-notification'
    //     });
    //     confirmDialogRef.afterClosed().subscribe(dialogResult => {
    //         if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
    //             this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.RearrangementSequencePosition, row: null, value: null });
    //             this.onSave.emit({ importXMLPath: '', rearrange: false });
    //             this.dialogRef.close();
    //         } else {
    //             this.onSave.emit({ importXMLPath: '', rearrange: false });
    //             this.dialogRef.close();
    //         }

    //     });

    // }




    massageReOrderWithoutClose() {
        const message = 'Do you want to rearrange control sequence according to their position?';

        const dialogData: ConfirmDialogData = {
            content: {
                title: 'Screen Designer',
                message: message,
                acceptLabel: 'OK',
                rejectLabel: 'No'
            },
            data: null
        };
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: dialogData,
            disableClose: true,
            width: '350px',
            panelClass: 'dps-notification'
        });
        confirmDialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.RearrangementSequencePosition, row: null, value: null });
                this.onSave.emit({ importXMLPath: '', rearrange: false });

            } else {
                this.onSave.emit({ importXMLPath: '', rearrange: false });
            }

        });



    }

    save(event) {


        if ((this.formView && this.formView.isFormViewChanged === true)
            || (this.formView.screenDefinition && this.formView.screenDefinition.ScreenDefType === 0)) {

            const message = 'Save Screen Design Changes ?';
            const dialogData: ConfirmDialogData = {
                content: {
                    title: 'Screen Designer',
                    message: message,
                    acceptLabel: 'OK',
                    rejectLabel: 'No'
                },
                data: null
            };
            const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: dialogData,
                disableClose: true,
                width: '350px',
                panelClass: 'dps-notification'
            });
            confirmDialogRef.afterClosed().subscribe(dialogResult => {
                if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                    this.massageReOrderWithoutClose();
                } else {
                    // this.dialogRef.close();
                }
            });

        } else {

            if (this.checkedOutScreenLogicDocuments.length > 0) {
                this.onSave.emit({ importXMLPath: '', rearrange: false });
            }
        }
    }



    prev(event) {
        const data: FormViewRequestViewModel = {
            appId: +this.screenDesingner.formView.screenDefinition.application,
            screenId: this.screenDesingner.screenIds[event.value - 1],
            currentIndex: +event.value - 1,
        };
        this.onViewChange.emit({ kind: ViewChangeKind.GoToPrevious, value: data });
    }

    next(event) {

        const data: FormViewRequestViewModel = {
            appId: +this.screenDesingner.formView.screenDefinition.application,
            screenId: this.screenDesingner.screenIds[event.value + 1],
            currentIndex: +event.value + 1,
        };
        this.onViewChange.emit({ kind: ViewChangeKind.GoToNext, value: data });
    }

    axisChange(event) {
        this.onViewChange.emit({ kind: ViewChangeKind.AxisChange, value: event.value });
    }

    displayTabOnRightBar() {
        const value = 1;
        this.onTabChange.emit(value);
    }

    onChangeSelectedTab(index) {
        this.onTabChange.emit(index);
    }


}
