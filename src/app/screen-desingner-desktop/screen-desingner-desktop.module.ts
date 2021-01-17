
import { MatProgressBarModule, MatProgressSpinnerModule, MatListModule, MatDialogModule, MatFormFieldModule } from '@angular/material';
import { ScreenDesingnerCoreModule } from '../screen-desingner-core/screen-designer-core.module';
// import { ScreenViewDesktopCoreModule } from './../screen-view-desktop/screen-view-desktop-core.module';
import { ScreenViewDesktop } from '../screen-view-desktop/screen-view-desktop.module';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { SharedModule } from '../shared/shared.module';
import { ScreenDesingnerPopupManagerComponent } from './containers/screen-desingner-desktop-manager.component';
import { ScreenDesingnerManagerComponent } from './containers/screen-desingner-manager.component';
import { ScreenDesingnerComponent } from './components/screen-desingner/screen-desingner.component';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { RightBarComponent } from './components/right-bar/right-bar.component';
import { ScreenViewContainerComponent } from './components/screen-view-container/screen-view-container.component';
import { EditContanerComponent } from './components/screen-view-container/edit-contaner/edit-contaner.component';
import { DynamicFormDesingnerComponent } from './components/screen-view-container/dynamic-form-desingner/dynamic-form-desingner.component';
import { ContanerDraggableDirective } from './components/screen-view-container/dynamic-form-desingner/contaner-draggable.directive';
import { OvItemUpdateComponent } from './components/ov-list/ov-item-update/ov-item-update.component';
import { OvListComponent } from './components/ov-list/ov-list.component';
import { MatIconModule } from '@angular/material/icon';
import { AlignFieldsComponent } from './components/right-bar/align-fields/align-fields.component';
import { FieldPropertiesComponent } from './components/right-bar/field-properties/field-properties.component';
import { ScreenParametersComponent } from './components/right-bar/screen-parameters/screen-parameters.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormContanerResizesDirective } from './components/screen-view-container/dynamic-form-desingner/form-contaner-resizes.directive';
import { DragSelectComponentsDirective } from './components/screen-view-container/dynamic-form-desingner/drag-select-components.directive';
import { ControllerIconPipe } from './components/ov-list/attachment-icon.pipe';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { EditLookupComponent } from './components/right-bar/field-properties/edit-lookup/edit-lookup.component';
import { LookupEditComponent } from './components/right-bar/field-properties/lookup-edit/lookup-edit.component';
import { VirtualScrollComponent } from './components/ov-list/virtual-scroll-component';
import { OvItemComponent } from './components/ov-list/ov-item/ov-item.component';
import { LabelUpdateComponent } from './components/ov-list/label-update/label-update.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { EditLookupPostcodeComponent } from './components/right-bar/field-properties/edit-lookup-postcode/edit-lookup-postcode.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ScreenDesingnerCoreModule,
    ScreenViewDesktop,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  declarations: [
    ScreenDesingnerPopupManagerComponent,
    ScreenDesingnerManagerComponent,
    ScreenDesingnerComponent,
    AlignFieldsComponent,
    FieldPropertiesComponent,
    HeaderBarComponent,
    RightBarComponent,
    ScreenParametersComponent,
    ScreenViewContainerComponent,
    DynamicFormDesingnerComponent,
    EditContanerComponent,
    ContanerDraggableDirective,
    OvListComponent,
    OvItemUpdateComponent,
    EditLookupComponent,
    LookupEditComponent,
    ControllerIconPipe,
    FormContanerResizesDirective,
    DragSelectComponentsDirective,
    VirtualScrollComponent,
    OvItemComponent,
    LabelUpdateComponent,
    EditLookupPostcodeComponent,

  ],
  exports: [
    ScreenDesingnerManagerComponent,
  ],
  entryComponents: [
    ScreenDesingnerPopupManagerComponent,
    OvItemUpdateComponent,
    EditLookupComponent,
    LookupEditComponent,
    LabelUpdateComponent,
    EditLookupPostcodeComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    }
  ],
})
export class ScreenDesingnerDesktop {
  popupComponent = ScreenDesingnerPopupManagerComponent;
}
