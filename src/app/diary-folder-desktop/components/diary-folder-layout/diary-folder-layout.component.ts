import { FolderNode, FolderFlatNode } from './../../../diary-folder-core/models/interfaces';

import {
  InforDialogData, InforDialogComponent, ConfirmDialogData,
  ConfirmDialogComponent, ConfirmDialogResultKind
} from './../../../shared';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource, MatTree, } from '@angular/material/tree';
import { DiaryFolderWrapper } from './../../../diary-folder-core';
import {
  Component, OnInit, Output, Input, EventEmitter, ViewChild,
  ElementRef, OnChanges, SimpleChanges, ViewEncapsulation
} from '@angular/core';
import { MatCheckboxChange, MatInput, MatCheckbox, MatDialog } from '@angular/material';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
// export class TreeDataSource extends MatTreeNestedDataSource<any> {
//   data: any[];
//   constructor(data: any[]) {
//     super();
//     this.data = data;
//   }
//   connect(): Observable<any[]> {
//     return observableOf(this.data);
//   }
//   disconnect() { }
// }
// export class TreeDataSource {


//   get data(): FolderFlatNode[] { return this.dataChange.value; }

//   constructor(d: any[]) {
//     this.initialize(d);
//   }
//   initialize(d: any[]) {
//     // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
//     //     file node as children.
//     const data = d;

//     // Notify the change.
//     this.dataChange.next(data);
//   }
// }


@Component({
  selector: 'dps-diary-folder-layout',
  templateUrl: './diary-folder-layout.component.html',
  styleUrls: ['./diary-folder-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiaryFolderLayoutComponent implements OnInit, OnChanges {



  @Input() isLoading: boolean;
  @Input() folders: DiaryFolderWrapper[];
  @Input() isSaving: boolean;
  @Input() folderDataSource: any;
  @Input() folderFlatData: FolderFlatNode[];
  @Input() indent: number;
  @Input() level: number;
  @Input() isDurty: boolean;


  @Output() closePopUp = new EventEmitter();
  @Output() addFolder = new EventEmitter();
  @Output() deleteFolder = new EventEmitter();
  @Output() cancelDeletedFolder = new EventEmitter();
  @Output() changeIsDefault = new EventEmitter();
  @Output() saveFoldersChanges = new EventEmitter();
  @Output() changeFolderName = new EventEmitter();
  @Output() addNewRootFolder = new EventEmitter();

  // tree changes
  @Output() changeRootFolder = new EventEmitter<any>();
  @Output() addRootFolder = new EventEmitter<any>();


  @ViewChild('input') private input: ElementRef;
  @ViewChild('tree') tree: MatTree<any>;
  @ViewChild('newFolder') newRootFolder: ElementRef;

  flatNodeMap = new Map<FolderNode, FolderFlatNode>();
  nestedNodeMap = new Map<FolderFlatNode, FolderNode>();
  treeControl = new NestedTreeControl<FolderFlatNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FolderFlatNode>();
  levels = new Map<FolderFlatNode, number>();
  folderValue = '';

  dataChange = new BehaviorSubject<FolderFlatNode[]>([]);
  constructor(private dialog: MatDialog) {

  }
  hasChild = (_: number, node: FolderFlatNode) => !!node.children && node.children.length > 0;
  isExpandable = (node: FolderFlatNode) => node.expanded;



  // get deletedFolders() {
  //   return Observable.create((observer: Subscriber<any>) => {
  //     observer.next(this.dataSource.data.filter(val => val.isDeleted));
  //     observer.complete();
  //   });
  // }
  // get notDeletedFolders() {

  //   return Observable.create((observer: Subscriber<any>) => {
  //     observer.next(this.dataSource.data.filter(val => !val.isDeleted));
  //     observer.complete();
  //   });
  // }
  ngOnInit() {
    // if (this.folderDataSource) {
    // this.dataSource.data = [];
    // this.dataSource = new TreeDataSource(this.list_to_tree(this.folderFlatData));

    // this.dataChange.next(data);         // this.folderDataSource;
    // }

    // const data = this.list_to_tree(this.folderFlatData);


    // const data = [{
    //   parentId: 0,
    //   position: 0,
    //   folderName: 'Fruit',
    //   folderId: 2,
    //   isExpandable: true,
    // }, {
    //   parentId: 2,
    //   position: 0,
    //   folderName: 'Apple',
    //   folderId: 10
    // }, {
    //   parentId: 2,
    //   position: 0,
    //   folderName: 'Banana',
    //   folderId: 11
    // }];

    const nodeData = this.list_to_tree(this.folderFlatData);

    // { "parentId": 2, "position": 0, "folderName": "Banana", "folderId": 11, "children": [] },

    this.dataChange.next(nodeData);
    this.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
    // const a = new TreeDataSource(data);
    // a.dataChange.subscribe(i => {
    //   this.dataSource.data = i;
    // });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.folderFlatData && changes.folderFlatData.currentValue) {

      const nodeData = this.list_to_tree(this.folderFlatData);



      this.dataChange.next(nodeData);
      this.dataSource.data = [];
      this.dataChange.subscribe(data => {
        this.dataSource.data = data;
      });

      this.folderValue = '';

    }
  }


  onClose() {
    this.closePopUp.emit();
  }
  onAdd(input: MatInput, checkbox: MatCheckbox) {
    if (input.value) {
      this.addFolder.emit({ text: input.value, selected: checkbox.checked });
      input.value = '';
      checkbox.checked = false;
    }
  }
  onDelete(node: FolderFlatNode, type) {
    if (node && node.children && node.children.length > 0 && type === 'DELETE') {
      const inforDialogData: InforDialogData = {
        content: {
          title: `Warning`,
          message: `Sub folders are there. Cannot Delete Folder.`
        },
        data: { messageType: 'alert' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: inforDialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: false,
        panelClass: 'dps-notification'
      });

    } else {
      this.deleteFolder.emit({ node, type });
    }

  }
  onCancelDeleted(folder: DiaryFolderWrapper) {
    this.cancelDeletedFolder.emit(folder);
  }
  onChangeIsDefault(folder: DiaryFolderWrapper, event: MatCheckboxChange) {
    this.changeIsDefault.emit({ folder, checked: event.checked });
  }
  onInputBlur(folder, input: MatInput) {
    this.changeFolderName.emit({ folder, text: input.value });
  }


  onSave(type) {
    if (this.folderFlatData && this.folderFlatData.length > 0) {
      const folders = this.folderFlatData.filter(val => val.selected);
      const emptyFolders = this.folderFlatData.filter(val => val.folderName === '' || val.folderName === null);
      if (emptyFolders.length > 0) {
        const inforDialogData: InforDialogData = {
          content: {
            title: `Validation failed`,
            message: `Name of the folder(s) cannot be empty.`
          },
          data: { messageType: 'alert' }
        };
        const dialogRef = this.dialog.open(InforDialogComponent, {
          data: inforDialogData,
          width: '400px',
          disableClose: true,
          hasBackdrop: false,
          panelClass: 'dps-notification'
        });

      } else if (folders.length === 0) {
        const inforDialogData: InforDialogData = {
          content: {
            title: `Validation failed`,
            message: `Please select a default folder`
          },
          data: { messageType: 'alert' }
        };
        const dialogRef = this.dialog.open(InforDialogComponent, {
          data: inforDialogData,
          width: '400px',
          disableClose: true,
          hasBackdrop: false,
          panelClass: 'dps-notification'
        });
      } else {

        this.saveFoldersChanges.emit(type);

      }

    }

  }
  onChangeParentInput(node, value, rootType) {

    this.changeRootFolder.emit({ node, value, rootType });


  }

  onChangeChildInput(node, value, rootType) {
    this.changeRootFolder.emit({ node, value, rootType });
  }

  onAddRootFolder(node, event) {
    //    const l = this.treeControl.getLevel(node);
    event.preventDefault();
    event.stopPropagation();
    if (this.folderFlatData && this.folderFlatData.length > 0) {
      const emptyFolders = this.folderFlatData.filter(val => val.folderName === '' || val.folderName === null);
      if (emptyFolders.length > 0) {
        const inforDialogData: InforDialogData = {
          content: {
            title: `Validation Failed`,
            message: `Name of the folder(s) cannot be empty.`
          },
          data: { messageType: 'alert' }
        };
        const dialogRef = this.dialog.open(InforDialogComponent, {
          data: inforDialogData,
          width: '400px',
          disableClose: true,
          hasBackdrop: false,
          panelClass: 'dps-notification'
        });

      } else {
        this.addRootFolder.emit(node);

      }


    }

  }

  addExpandedAttr(data) {
    if (Array.isArray(data)) { // if data is an array
      data.forEach((d) => {
        d.expanded = false;
        this.addExpandedAttr(d);
      }); // call the function on each item
    } else if (data instanceof Object) { // otherwise, if data is an object
      data.expanded = false; // add prop to object
      (data.children || []).forEach((c) => {
        this.addExpandedAttr(c); // and call function on each child
      });
    }
  }


  changeState(node) {
    node.expanded = !node.expanded;
  }


  list_to_tree(list: FolderFlatNode[]) {
    const map = {};
    let node: FolderFlatNode;
    const roots: FolderFlatNode[] = [];
    let i;
    if (list && list.length > 0) {

      for (i = 0; i < list.length; i += 1) {
        map[list[i].folderId] = i; // initialize the map
        list[i].children = []; // initialize the children
      }

      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parentId !== 0) {
          // if you have dangling branches check that map[node.parentId] exists
          if (list[map[node.parentId]] && list[map[node.parentId]].children) {
            list[map[node.parentId]].children.push(node);
          }
        } else {
          roots.push(node);
        }
      }
      return roots;
    } else {

      return roots;
    }
  }



  onIsDefault(node, event) {
    this.changeIsDefault.emit({ node, checked: event.checked });

  }

  onAddNewRootFolder(value) {
    if (value !== '') {
      // if (value !== 'Add New Folder') {

      this.folderValue = value;
      //   }
    } else {
      this.folderValue = '';
    }
    //  this.folderValue = 'Add New Folder';


  }

  onnewRootFolderForcus() {
    if (this.folderValue !== '') {
      this.addNewRootFolder.emit(this.folderValue);
    }
    this.folderValue = '';   // this.newRootFolder.nativeElement.focus();

  }

  onAddFolder(value) {

    if (value !== '') {
      this.addNewRootFolder.emit(value);
    }
    this.folderValue = '';   // this.newRootFolder.nativeElement.focus();

  }




}
