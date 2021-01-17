
import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import {
    getTeamMembersByToken, getTeamMemberLoadingStatusByToken, getSearchKeyByToken,
    getSelectedTeamMemberByToken
} from '../../team-member-core/reducers';
import { ChangeTeamMemberSearchKey, ChangeSelectedTeamMember } from '../../team-member-core/actions/team-member';

@Component({
    exportAs: 'dps-team-member-manager',
    selector: 'dps-team-member-manager',
    template: '<ng-content></ng-content>',
    styles: []
})
export class TeamMemberManagerComponent implements OnInit {

    @Input() teamMemberToken: string;
    teamMemberList$;
    teamMembersLoading$: any;
    searchKey$: any;
    selected$: any;
    constructor(private store: Store<any>) { }

    ngOnInit() {
        this.teamMemberList$ = this.store.select(getTeamMembersByToken(this.teamMemberToken));
        this.teamMembersLoading$ = this.store.select(getTeamMemberLoadingStatusByToken(this.teamMemberToken));
        this.searchKey$ = this.store.select(getSearchKeyByToken(this.teamMemberToken));
        this.selected$ = this.store.select(getSelectedTeamMemberByToken(this.teamMemberToken));
    }
    onSearchTextChanged(searchText) {
        this.store.dispatch(new ChangeTeamMemberSearchKey(this.teamMemberToken, searchText));
    }
    onchangeSelectedTeamMember(teamMember) {
        if (teamMember) {
            if (!teamMember.selected) {
                this.store.dispatch(new ChangeSelectedTeamMember(this.teamMemberToken, teamMember));
            }
        }
    }

}
