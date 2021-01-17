import { getFormsLibrarytreeByToken } from './../reducers/index';

import { Injectable, Injector } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { FormsLibraryService } from '../services/forms-library.service';
import * as FormLibrary from '../actions/core';
import { map, mergeMap, switchMap, catchError, filter, take } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { getMatterMatterData } from '../reducers';
import { GetOpenCaseToken } from '../../core/lib/open-case';
// import { switchMap, tap, catchError, map, mergeMap } from 'rxjs/operators';
import { RunWorkflowCommand } from '../../workflow-menu-core/actions/core';
import { TreeDataWrapper } from '../models/interfce';
import { WorkflowMenuMetaDataWrapper, WorkflowMenuMetaItem } from '../../workflow-menu-core';

@Injectable()
export class FormsLibraryEffects {

  constructor(private actions$: Actions, private store: Store<any>,
    private formsLibraryService: FormsLibraryService, private injector: Injector) { }

  @Effect()
  initPostingPeriod$ = this.actions$.pipe(ofType<FormLibrary.InitFormsLibrary>(FormLibrary.INIT_FORMS_LIBRARY),
    switchMap(action => this.store.select(getFormsLibrarytreeByToken(action.token)).pipe(take(1),
      map(treeData => ({ formslibraryTree: treeData, token: action.token })))),
    filter(info => !info.formslibraryTree),
    mergeMap(action => from([
      new FormLibrary.GetFormsLibraryData(action.token),
    ])));

  @Effect()
  getFlDataTree$ = this.actions$.pipe(ofType<FormLibrary.GetFormsLibraryData>(FormLibrary.GET_FORMS_LIBRARY_DATA),
    switchMap(action =>
      this.formsLibraryService.getFormsLibraryTreeData().pipe(map((respond) =>
        new FormLibrary.GetFormsLibraryDatauccess(action.token, { fileDirectoryTree: respond })),
        catchError(error => of(new FormLibrary.GetFormsLibraryDataFail(action.token, error)))
      )
    ));

  @Effect({ dispatch: false })
  screenOptionRun$ = this.actions$.pipe(ofType<FormLibrary.RunLetterEnging>(FormLibrary.FORMS_LIBRARY_RUN_LETTER_ENGIN),
    switchMap(action => this.store.select(getMatterMatterData(action.token)).pipe(
      take(1),
      map(matterData => {
        const openCaseToken = GetOpenCaseToken(matterData.matterReferenceNo);
        this.store.dispatch(new RunWorkflowCommand(openCaseToken,
          this.injector, this.getCreateItemNewMenuItem(action.menuInfo, matterData.appID),
          {
            isFormLibraryTemplate: true,
            formLibraryTemplatePath: action.menuInfo.data.path
          }));
      })
    )));
  getCreateItemNewMenuItem(treeDataWrapper: TreeDataWrapper, appId: number) {
    let newItem: WorkflowMenuMetaDataWrapper = null;
    if (treeDataWrapper) {
      const newMenuNode: WorkflowMenuMetaItem = {
        atN_AppID: + appId,
        atN_Command: treeDataWrapper.data.description,
        atN_Desc: '',
        atN_Help: '',
        atN_ID: 0,
        atN_Level: 0,
        atN_Order: 0,
        atN_ParentID: null,
        atN_ParentMenu: null,
        atN_Type: 4, // Menu
        createUser: '',
        dateDone: '',
        nodeStatus: 0,
      };
      const newNode: WorkflowMenuMetaDataWrapper = {
        treeId: null,
        parentId: null,
        treeLevel: 0,
        isRowEdit: false,
        isRightClick: false,
        isRowSelected: false,
        indexId: 0,
        data: newMenuNode,
        items: [],
        enabled: true,
        isTreeNodeExpand: false,
      };
      newItem = newNode;
    }
    return newItem;
  }
}
