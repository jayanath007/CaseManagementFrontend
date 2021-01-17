
import { takeUntil, withLatestFrom, scan, map } from 'rxjs/operators';
import { Component, OnInit, ViewContainerRef, Input, Output, ChangeDetectionStrategy, ViewChild, EventEmitter } from '@angular/core';
import {
  Overlay, OverlayConfig, ConnectionPositionPair
} from '@angular/cdk/overlay';
import {
  ComponentPortal,
  Portal,
  TemplatePortalDirective
} from '@angular/cdk/portal';

import { Subject, BehaviorSubject, merge } from 'rxjs';






import { Operator, Condition, Logic, FieldType, Filter } from '../../../odata';
import { ComponentBase } from '../../../core';

interface LocalState {
  isMenuOpen: boolean;
  filterGroup: Filter<Condition>;
}

interface FormAction {
  type: string;
  value: any;
  index: number;
}

function formInteractionReducer(action: FormAction): (state: LocalState) => LocalState {
  return (state: LocalState) => {
    switch (action.type) {
      case 'LOGIC':
        return { ...state, filterGroup: { ...state.filterGroup, logic: action.value } };

      case 'OPERATOR':
        return {
          ...state, filterGroup: {
            ...state.filterGroup,
            filters: changeFilterOperator(state.filterGroup.filters, action.value, action.index)
          }
        };

      case 'VALUE':
        return {
          ...state, filterGroup: {
            ...state.filterGroup,
            filters: changeFilterValue(state.filterGroup.filters, action.value, action.index)
          }
        };

      default: {
        return state;
      }
    }
  };
}

function changeFilterOperator(filters: Condition[], value: Operator, index: number): Condition[] {
  return filters.map((item, _index) => {
    if (_index === index) {
      return { ...item, operator: value };
    }
    return item;
  });
}

function changeFilterValue(filters: Condition[], value: string | Date, index: number): Condition[] {
  // const myValue = value instanceof Date ? value.toString() : value;
  return filters.map((item, _index) => {
    if (_index === index) {
      return { ...item, value: value };
    }
    return item;
  });
}

@Component({
  selector: 'dps-grid-field-filter',
  templateUrl: './grid-field-filter.component.html',
  styleUrls: ['./grid-field-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridFieldFilterComponent extends ComponentBase implements OnInit {

  Logic = Logic;

  @Input() active: boolean;
  @Output() filter = new EventEmitter();
  @Output() clear = new EventEmitter();


  menuState$ = new Subject();
  formInteractions$ = new Subject();
  globalState$ = new BehaviorSubject({});
  localState$;
  dispatcher$ = new Subject();

  position: ConnectionPositionPair[] = [new ConnectionPositionPair({ originX: 'end', originY: 'bottom' },
    { overlayX: 'end', overlayY: 'top' })];

  constructor(public overlay: Overlay, public viewContainerRef: ViewContainerRef) {
    super();
  }

  @Input()
  set filterGroup(value: Filter<Condition>) {
    if (value) {
      this.globalState$.next(JSON.parse(JSON.stringify(value)));
    }
  }

  @Input()
  set anchor(value) {
    if (value) {
      this.position = [new ConnectionPositionPair({ originX: value, originY: 'bottom' },
        { overlayX: value, overlayY: 'top' })];
    }
  }

  ngOnInit() {
    this.localState$ = merge(this.menuState$.pipe(
      map(action =>
        (state: LocalState) => ({ ...state, isMenuOpen: !state.isMenuOpen })
      )),
      this.formInteractions$.pipe(map((action: FormAction) => formInteractionReducer(action))),
      this.globalState$.pipe(map((globalState: Filter<Condition>) =>
        (state: LocalState) => ({ ...state, filterGroup: globalState })))
    ).pipe(
      scan((state, redeucer: any) => redeucer(state), { isMenuOpen: false, filterGroup: null }));


    this.dispatcher$.pipe(withLatestFrom(this.localState$, (type, state) => ({ type, state })),
      takeUntil(this.destroy$))
      .subscribe(({ type, state }: { type: string, state: LocalState }) => {

        if (type === 'FILTER') {
          this.filter.emit(state.filterGroup);
        }
        if (type === 'CLEAR') {
          this.clear.emit(state.filterGroup);
        }
        this.menuState$.next();
      });

  }

  hasFilterData(state: LocalState) {
    if (!state) {
      return false;
    }
    if (!state.filterGroup) {
      return false;
    }

    if (!state.filterGroup.filters) {
      return false;
    }

    return true;
  }

  getCondition(state: LocalState, index) {
    if (!this.hasFilterData(state)) {
      return null;
    }
    return state.filterGroup.filters[index];
  }

  getFilterLogic(state: LocalState) {
    if (!state) {
      return '';
    }
    if (!state.filterGroup) {
      return '';
    }

    return state.filterGroup.logic;
  }

  toggleFilter() {
    this.menuState$.next();
  }

  formFieldChange(type, value, index) {
    this.formInteractions$.next({ type, value, index });
  }

  onClear() {
    console.log('onClear');
    this.dispatcher$.next('CLEAR');
  }

  onFilter() {
    console.log('onFilter');
    this.dispatcher$.next('FILTER');
  }

}


