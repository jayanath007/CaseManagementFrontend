
import {takeUntil, map} from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { LookupEditComponent } from '../lookup-edit/lookup-edit.component';
import { ScreenListItemsChangeKind } from '../../../../../screen-desingner-core/actions/core';
import { FieldPropertiesService } from '../../../../../screen-desingner-core/services/field-properties.service';
import { UiComponentType } from '../../../../../screen-view-core/models/screen-contaner-component';
import { EditLookupPostcodeComponent } from '../edit-lookup-postcode/edit-lookup-postcode.component';
import { Subject ,  Observable } from 'rxjs';
import { ConfirmDialogData, InforDialogComponent } from '../../../../../shared';


@Component({
  selector: 'dps-edit-lookup',
  templateUrl: './edit-lookup.component.html',
  styleUrls: ['./edit-lookup.component.scss']
})
export class EditLookupComponent implements OnInit, OnDestroy {

  constructor(public dialog: MatDialog, private store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditLookupComponent>, private fieldProperties: FieldPropertiesService) { }

  content: string;
  private unsubscribe: Subject<void> = new Subject();
  lookupFileContent$: Observable<any>;

  ngOnInit() {


  }
  viewContanet(fileName) {

    this.lookupFileContent$
      = this.fieldProperties.getLookupFileContent(+this.data.screenDefinition.application, fileName).pipe(
        map((response) => {
          const content = response.data;
          if (this.data.selectedContanerComponent.uiComponentType === UiComponentType.PostCode ||
            this.data.selectedContanerComponent.uiComponentType === UiComponentType.AddressSearch) {


            if (this.validateTextFileInPostCode(content, this.data.selectedContanerComponent.uiComponentType)) {
              this.dialog.open(EditLookupPostcodeComponent, {
                width: '350px',
                data: {
                  screenDefinition: this.data.screenDefinition,
                  textFileData: '',
                  fileName: fileName,
                  content: content,
                  selectedContanerComponent : this.data.selectedContanerComponent
                },
                disableClose: true,
                panelClass: 'screen-edit-popoup'
              });
            } else {
              let txtValue = 'invalid text file for Address Search';
              if (this.data.selectedContanerComponent.uiComponentType === UiComponentType.PostCode) {
                txtValue = 'invalid text file for Post Code';
              }

              this.messageDialog(txtValue);
            }

          } else {

            let line = '\n';
            let fileContent = '';
            for (let i = 0; i < content.length; i++) {
              if (i === content.length - 1) {
                line = '';
              }
              fileContent = fileContent + content[i] + line;
            }

            this.dialog.open(LookupEditComponent, {
              width: '350px',
              data: {
                screenDefinition: this.data.screenDefinition,
                textFileData: fileContent,
                fileName: fileName
              },
              disableClose: true,
              panelClass: 'screen-edit-popoup'
            });
          }

        })).pipe(takeUntil(this.unsubscribe));

    this.lookupFileContent$.subscribe(
      e => console.log(`ok: ${e}`),
      e => console.log(`error: ${e}`),
      () => console.log('complete!'));

  }


  validateTextFileInPostCode(content: string[] , uiComponentType : UiComponentType ) {

    if (content.length === 0 ||
       (content.length === 5 && uiComponentType === UiComponentType.AddressSearch) ||
      (content.length === 4 && uiComponentType === UiComponentType.PostCode)) {

      content.forEach((data) => {
        if (!isNaN(+data)) {
          return false;
        }
      });
      return true;
    } else {
      return false;
    }

  }



  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setDroDownValue(dataItem) {
    this.dialogRef.close({ kind: ScreenListItemsChangeKind.UpdateValue, data: dataItem });
  }

  onClose() {
    this.dialogRef.close({ kind: 'close', data: null });
  }


  messageDialog(messageText) {
    const headingText = 'Lookup';
    const dialogData: ConfirmDialogData = {
      content: {
        title: headingText,
        message: messageText,
        acceptLabel: 'OK',
      },
      data: { messageType: 'alert' }
    };
    this.dialog.open(InforDialogComponent, {
      data: dialogData,
      disableClose: true,
      width: '350px',
      panelClass: 'dps-notification'
    });
  }


}
