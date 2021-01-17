import { Store } from '@ngrx/store';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { BaseTemplateDirectoryManager } from '../../safe-box-explorer-core';
import { IS_GOOGLE } from '../../shared';


@Component({
  selector: 'dps-template-directory-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})

export class TemplateDirectoryManagerComponent extends BaseTemplateDirectoryManager implements OnInit {

  @Output() appSelect = new EventEmitter();

  constructor(store: Store<any>, @Inject(IS_GOOGLE) public isGoogle: string) {
    super(store);
  }

  ngOnInit() {
    super.onInit(this.isGoogle);
  }
  onSelectApp(event) {
    this.appSelect.emit();
    this.selectApp(event);
  }
  onToggleAppListExpand() {
    this.toggleAppListExpand();
  }
}

