import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ScreenDesingnerRequestViewModel } from '../../screen-desingner-core/models/screen-desingner-request';

@Component({
  selector: 'dps-screen-desingner-popup-manager',
  template: `
      <dps-screen-desingner-manager  [inputData]="data.input"
        [token]="data.token" #screenDesingner="screenDesingnerManage" >
        <dps-screen-desingner
         [formView]="screenDesingner.formView$ | async "
         [closePopup]="screenDesingner.closePopup$ | async"
         [ovItemList]="screenDesingner.ovItemList$ | async "
         [lookupFiles]="screenDesingner.lookupFiles$ | async "
         [masageCount]="screenDesingner.messageCount$ | async "
         [selectedOvItem]="screenDesingner.selectedOvItem$ | async "
         [searchText]="screenDesingner.searchText$ | async "
         [selectedContanerComponent]="screenDesingner.selectedContanerComponent$ | async "
         [screenDesingner]="screenDesingner.screenDesingner$ | async "
         [screenLogicDocuments]="screenDesingner.screenLogicDocuments$ | async"
         [checkedOutScreenLogicDocuments]="screenDesingner.checkedOutScreenLogicDocuments$ | async"
  



         (onComponentChange)="screenDesingner.onScreenDesingnerComponentChange(data.token, $event)"
         (onScreenDefinitionChange)="screenDesingner.onScreenDesingnerScreenDefinitionChange(data.token, $event)"
         (onOvChange)="screenDesingner.onScreenDesingnerOvUpdate(data.token,$event)"
         (onGetlookUpData)="screenDesingner.getlookUpData(data.token,$event)"
         (onViewChange)="screenDesingner.onScreenDesingnerChange(data.token,$event)"
         (onSave)="screenDesingner.onScreenDesingnerSave(data.token,$event)"
         (onSearchTextChange)="screenDesingner.onSearchTextChange(data.token,$event)"
         (onLogicDodumentView)="screenDesingner.onLogicDodumentView(data.token,$event)"
         (onTabChange)="screenDesingner.onTabChange(data.token,$event)"
         (onExportOvList)="screenDesingner.onExportOvList(data.token,$event)"
         (onExportXMLList)="screenDesingner.onExportScreenToXML(data.token,$event)"
         (onCreateLookup)="screenDesingner.onCreatelookupFile(data.token,$event)"
         (onCloseScreenDesigner)="screenDesingner.onCloseScreenDesigner(data.token)"
         

         (onDiscardCheckin)="screenDesingner.doDiscardCheckin($event)"
         (onCheckin)="screenDesingner.doCheckin($event)"

         >
       </dps-screen-desingner>
    </dps-screen-desingner-manager>
    `,
  styles: []
})
export class ScreenDesingnerPopupManagerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    input: ScreenDesingnerRequestViewModel,
    token: string
  }) {

  }

  ngOnInit() {
  }



}
