import { EditScreenLookupFileUploadSelectComponent } from './components/edit-screen-lookup-file-upload-select/edit-screen-lookup-file-upload-select.component';
import { EditScreenTextareaComponent } from './components/edit-screen-textarea/edit-screen-textarea.component';
import { EditScreenUnbindSelectComponent } from './components/edit-screen-unbind-select/edit-screen-unbind-select.component';
import { EditScreenSingleColumnSelectComponent } from './components/edit-screen-single-column-select/edit-screen-single-column-select.component';
import { EditScreenDatepickerComponent } from './components/edit-screen-datepicker/edit-screen-datepicker.component';
import { EditScreenLableComponent } from './components/edit-screen-lable/edit-screen-lable.component';
import { EditScreenTabComponent } from './components/edit-screen-tab/edit-screen-tab.component';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatTooltipModule,
  MatIconModule, MatAutocompleteModule, MatListModule, MatExpansionModule, MatCheckboxModule, MatRadioModule,
  MatDatepickerModule, MatNativeDateModule, MatPaginatorModule, MAT_DATE_LOCALE, DateAdapter
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditScreenTextInputComponent } from './components/edit-screen-text-input/edit-screen-text-input.component';
import { EditScreenBranchSelectComponent } from './components/edit-screen-branch-select/edit-screen-branch-select.component';
import { SelectSearchComponent } from './components/select-search/select-search.component';
import { EditScreenCheckboxComponent } from './components/edit-screen-checkbox/edit-screen-checkbox.component';
import { EditScreenRadioButtonComponent } from './components/edit-screen-radio-button/edit-screen-radio-button.component';
import { EditScreenButtonComponent } from './components/edit-screen-button/edit-screen-button.component';
import { EditScreenLookupSelectComponent } from './components/edit-screen-lookup-select/edit-screen-lookup-select.component';
import { EditScreenPaginatorComponent } from './components/edit-screen-paginator/edit-screen-paginator.component';
import { EditScreenInputSearchComponent } from './components/edit-screen-input-search/edit-screen-input-search.component';
import { EditScreenNumberInputComponent } from './components/edit-screen-number-input/edit-screen-number-input.component';
import { DateFormat } from '../utils/date-format';
import { EditScreenFindAddressInputComponent } from './components/edit-screen-find-address-input/edit-screen-find-address-input.component';
import { EditScreenEditableDropdownComponent } from './components/edit-screen-editable-dropdown/edit-screen-editable-dropdown.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule
  ],
  exports: [
    // modules
    // components
    EditScreenTextInputComponent,
    EditScreenBranchSelectComponent,
    SelectSearchComponent,
    EditScreenTabComponent,
    EditScreenLableComponent,
    EditScreenCheckboxComponent,
    EditScreenRadioButtonComponent,
    EditScreenButtonComponent,
    EditScreenDatepickerComponent,
    EditScreenSingleColumnSelectComponent,
    EditScreenLookupSelectComponent,
    EditScreenPaginatorComponent,
    EditScreenUnbindSelectComponent,
    EditScreenInputSearchComponent,
    EditScreenTextareaComponent,
    EditScreenLookupSelectComponent,
    EditScreenLookupFileUploadSelectComponent,
    EditScreenNumberInputComponent,
    EditScreenFindAddressInputComponent,
    EditScreenEditableDropdownComponent
    // ExceptionIndicatorComponent,
    // pipes
    // Directive
  ],
  declarations: [
    EditScreenTextInputComponent,
    EditScreenBranchSelectComponent,
    SelectSearchComponent,
    EditScreenTabComponent,
    EditScreenLableComponent,
    EditScreenCheckboxComponent,
    EditScreenRadioButtonComponent,
    EditScreenButtonComponent,
    EditScreenDatepickerComponent,
    EditScreenSingleColumnSelectComponent,
    EditScreenLookupSelectComponent,
    EditScreenPaginatorComponent,
    EditScreenUnbindSelectComponent,
    EditScreenInputSearchComponent,
    EditScreenTextareaComponent,
    EditScreenLookupSelectComponent,
    EditScreenLookupFileUploadSelectComponent,
    EditScreenNumberInputComponent,
    EditScreenFindAddressInputComponent,
    EditScreenEditableDropdownComponent
  ],
  providers: [

    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DateFormat },

    // ValidateEmailPipe,
    // TimezonePipe,
    // DatePipe,
    // { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    // CurrencySymbolsPipe, DecimalPipe
  ],
  entryComponents: []
})
export class EditableControlBaseModule { }
