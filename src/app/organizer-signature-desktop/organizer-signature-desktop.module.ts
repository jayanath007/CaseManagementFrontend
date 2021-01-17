// import { OrganizerSignatureLayoutComponent } from './components/organizer-signature-layout/organizer-signature-layout.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatButtonModule, MatDialogModule, MatIconModule, MatSlideToggleModule, MatListModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {SignatureSettingsManagerComponent} from './containers/organizer-signature-manager.component';


@NgModule({
    imports: [
      CommonModule,
      MatButtonModule,
      MatDialogModule,
      MatIconModule,
      MatSlideToggleModule,
      MatListModule,
      FormsModule,
    ],
    // exports: [OrganizerSignatureLayoutComponent],
     declarations: [SignatureSettingsManagerComponent],
    // entryComponents: [OrganizerSignatureLayoutComponent]
  })
export class OrganizerSignatureDesktopModule { }

