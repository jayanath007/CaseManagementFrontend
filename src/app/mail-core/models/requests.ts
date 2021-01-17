import { DatePipe } from '@angular/common';
import { Message } from '../../core/lib/microsoft-graph';
import { FilterTypes, OrderBy, SortDir, SerchDateTypes } from './enums';

export class MailItemRequest {
    private datePipe = new DatePipe('en-US');
    constructor(
        public isFullLoad: boolean,
        public requestHash: string,
        public isSearching: boolean,
        public start: number,
        public size: number,
        public orderBy: OrderBy,
        public sortDir: SortDir,
        public filter: FilterTypes,
        public searchText: string,
        public isAllFolders: boolean,
        public hasAttachment: boolean,
        public from: string,
        public dateType: SerchDateTypes,
        public dateFrom: string,
        public dateTo: string,
        public folderOwner: string,
        public folderId?: string,
        public wellKnownName?: string,
    ) { }

    clone() {
        return new MailItemRequest(this.isFullLoad,
            this.requestHash,
            this.isSearching,
            this.start,
            this.size,
            this.orderBy, this.sortDir,
            this.filter,
            this.searchText,
            this.isAllFolders,
            this.hasAttachment,
            this.from, this.dateType, this.dateFrom, this.dateTo, this.folderOwner, this.folderId, this.wellKnownName);
    }
    setStart(value: number) {
        this.start = value;
        return this;
    }

    get oDataFilter(): string {
        switch (this.filter) {

            case FilterTypes.Flagged: {
                switch (this.orderBy) {
                    case OrderBy.From: {
                        return `from/emailAddress/name ne '_' and
                        receivedDateTime ge 1900-01-01T00:00:00Z and flag/flagStatus eq 'flagged'`;
                    }
                    case OrderBy.Subject: {
                        return `(subject eq '' or subject ne '') and
                        receivedDateTime ge 1900-01-01T00:00:00Z and flag/flagStatus eq 'flagged'`;
                    }
                    case OrderBy.Attachment: {
                        return `(hasAttachments eq true or hasAttachments eq false) and
                        receivedDateTime ge 1900-01-01T00:00:00Z and flag/flagStatus eq 'flagged'`;
                    }
                    case OrderBy.Importance: {
                        return `(importance eq 'low' or importance eq 'normal' or importance eq 'high') and
                        receivedDateTime ge 1900-01-01T00:00:00Z and flag/flagStatus eq 'flagged'`;
                    }
                    case OrderBy.Date:
                    default:
                        {
                            return `receivedDateTime ge 1900-01-01T00:00:00Z and flag/flagStatus eq 'flagged'`;
                        }
                }
            }

            case FilterTypes.Unread: {
                return `isRead eq false`;
            }

            case FilterTypes.ToMe:
            case FilterTypes.All:
            default: {
                return null;
            }
        }
    }

    get oDataOrderBy() {
        switch (this.orderBy) {
            case OrderBy.From: {
                return `from/emailAddress/name ${this.oDataSortDir},receivedDateTime desc`;
            }
            case OrderBy.Subject: {
                return `subject ${this.oDataSortDir},receivedDateTime desc`;
            }
            case OrderBy.Attachment: {
                return `hasAttachments ${this.oDataSortDir},receivedDateTime desc`;
            }
            case OrderBy.Importance: {
                return `importance ${this.oDataSortDir},receivedDateTime desc`;
            }
            case OrderBy.Date:
            default:
                {
                    return `receivedDateTime ${this.oDataSortDir}`;
                }
        }
    }

    get oDataSortDir() {
        if (this.sortDir === SortDir.Asc) {

            return 'asc';
        }
        return 'desc';
    }

    get inverseODataSortDir() {
        return this.oDataSortDir === 'asc' ? 'desc' : 'asc';
    }

    get oDataSearch(): string {
        let searchQuery = this.searchText.replace(/#|&|"|\\/g, ' ');
        if (this.from) {
            searchQuery = searchQuery + ` AND from:${this.from}`;
        }
        if (this.hasAttachment) {
            searchQuery = searchQuery + ` AND hasAttachment:${this.hasAttachment}`;
        }
        switch (this.dateType) {
            case SerchDateTypes.All:
                break;
            case SerchDateTypes.ThisWeek:
                const curr = new Date;
                const first = curr.getDate() - curr.getDay();
                const last = first + 6;
                const firstday = this.datePipe.transform(new Date(curr.setDate(first)), 'shortDate');
                const lastday = this.datePipe.transform(new Date(curr.setDate(last)), 'shortDate');
                searchQuery = searchQuery + ` AND received>=${firstday} AND received<=${lastday}`;
                break;
            case SerchDateTypes.ThisMonth:
                const date = new Date(), y = date.getFullYear(), m = date.getMonth();
                const firstDay = this.datePipe.transform(new Date(y, m, 1), 'shortDate');
                const lastDay = this.datePipe.transform(new Date(y, m + 1, 0), 'shortDate');
                searchQuery = searchQuery + ` AND received>=${firstDay} AND received<=${lastDay}`;
                break;
            case SerchDateTypes.SelectRange:
                if (this.dateFrom) {
                    searchQuery = searchQuery + ` AND received>=${this.datePipe.transform(new Date(this.dateFrom), 'shortDate')}`;
                }
                if (this.dateTo) {
                    searchQuery = searchQuery + ` AND received<=${this.datePipe.transform(new Date(this.dateTo), 'shortDate')}`;
                }
                break;
        }
        return searchQuery;
    }

    get folder() {
        if (this.isAllFolders) {
            return '';
        } else {
            return `/mailFolders/${this.wellKnownName ? this.wellKnownName : this.folderId}`;
        }
    }

}

export class MailItemResponse {
    constructor(public items: Message[], public total: number) { }
}
