import { ScreenDefinition } from './screen-definition';
import { Matter } from '../../core/lib/matter';
import { ContactSearchType } from '../../screen-contact-core/models/interface';

export interface ICallbackData {
    token: string;
    matterDetails: Matter;
    screenDefinition: ScreenDefinition;
    searchType: ContactSearchType;
    fontSizeClass: string;
    contactLockedPermission: boolean;
    mappedField: string;
    fieldValue: string;
}
