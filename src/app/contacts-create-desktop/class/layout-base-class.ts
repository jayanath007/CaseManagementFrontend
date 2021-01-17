import { Input, Output, EventEmitter } from '@angular/core';
import { ContactViewModel, ContactType } from '../../contacts-create-core/models/interfaces';
import { TabIndex, Section } from '../../contacts-create-core/models/enum';
import { ColumnDef } from './../../core/lib/grid-model';
import { Mode } from './../../client-creation-core/models/enums';
import { MatterInfo } from '../../core';
import { CaseContact } from '../../case-contact-core/models/interface';

export class LayoutBaseClass {
    constructor() {
    }
    @Input() isLoading: boolean;
    @Input() selectedContact: ContactViewModel;
    @Input() contactSearchKey: string;
    @Input() showSearchTab: boolean;
    @Input() selectedTab: TabIndex;
    @Input() token: string;
    @Input() mode: Mode;
    @Input() otherContactCol: ColumnDef[];
    @Input() types: ContactType[];
    @Input() matterData: MatterInfo;
    @Output() searchTextChanged = new EventEmitter<string>();
    @Output() changeSelectedTab = new EventEmitter<TabIndex>();
    @Output() selectContact = new EventEmitter<{contactInfo: CaseContact, close: boolean }>();
    @Output() changeDetails = new EventEmitter<{ type: string, value: string, section: Section }>();

    onSearchTextChanged(key: string) {
        this.searchTextChanged.emit(key);
    }

    onChangeSelectedTab(index) {
        this.changeSelectedTab.emit(index);
    }

    onChangeContact(data: { contactInfo: CaseContact, close: boolean }) {
        this.selectContact.emit(data);
    }

    onChangeDetails(event: { type: string, value: string, section: Section }) {
        this.changeDetails.emit(event);
    }
}
