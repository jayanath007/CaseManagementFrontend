import { AttachmentIconPipe } from '../../shared';

export class OfficeUriSchemes {
    constructor(public webUrl: string, public name: string, public drivePath: string) { }

    public getSchemeName() {
        const type = new AttachmentIconPipe().transform(this.name, 'type');
        if (type) {
            switch (type.toLowerCase()) {
                case 'doc':
                    return 'ms-word:';
                case 'docx':
                    return 'ms-word:';
                case 'docm':
                    return 'ms-word:';
                case 'docb':
                    return 'ms-word:';
                case 'dot':
                    return 'ms-word:';
                case 'dotx':
                    return 'ms-word:';
                case 'dotm':
                    return 'ms-word:';
                case 'wbk':
                    return 'ms-word:';
                case 'odt':
                    return 'ms-word:';

                case 'ppt':
                    return 'ms-powerpoint:';
                case 'pptx':
                    return 'ms-powerpoint:';
                case 'pptm':
                    return 'ms-powerpoint:';
                case 'pot':
                    return 'ms-powerpoint:';
                case 'potx':
                    return 'ms-powerpoint:';
                case 'potm':
                    return 'ms-powerpoint:';
                case 'pps':
                    return 'ms-powerpoint:';
                case 'ppsx':
                    return 'ms-powerpoint:';
                case 'ppsm':
                    return 'ms-powerpoint:';
                case 'ppam':
                    return 'ms-powerpoint:';
                case 'sldx':
                    return 'ms-powerpoint:';
                case 'sldm':
                    return 'ms-powerpoint:';

                case 'xls':
                    return 'ms-excel:';
                case 'xlsx':
                    return 'ms-excel:';
                case 'xlsm':
                    return 'ms-excel:';
                case 'xlt':
                    return 'ms-excel:';
                case 'xltx':
                    return 'ms-excel:';
                case 'xltm':
                    return 'ms-excel:';
                case 'xlm':
                    return 'ms-excel:';
                case 'xlsb':
                    return 'ms-excel:';
                case 'xla':
                    return 'ms-excel:';
                case 'xlam':
                    return 'ms-excel:';
                case 'xll':
                    return 'ms-excel:';
                case 'xlw':
                    return 'ms-excel:';

                default:
                    return '';
            }
        }
        return '';

    }

    public getCommandArgument() {
        let url = '';
        let folder = 'Documents';
        if (this.webUrl) {
            const split = this.webUrl.split('/');
            if (split.length >= 5 && split[2].includes('.sharepoint.com') && (split[3] === 'personal' || split[3] === 'sites')) {
                split.length = 5;
                url = split.join('/');
            }
            if (split[3] === 'sites') {
                folder = 'Shared Documents';
            }
        }
        let path = '';
        if (this.drivePath) {
            const split = this.drivePath.split('/');
            if (split.length >= 4 && split[1] === 'drives' && split[3] === 'root:') {
                split.splice(0, 4);
                path = split.join('/');
            }
        }
        return `${url}/${folder}/${path ? (path + '/') : ''}${this.name}`;
    }

    public getFullURI(isEdit?: boolean) {
        const command = isEdit ? 'ofe|u|' : 'ofv|u|';
        return this.getSchemeName() + command + this.getCommandArgument();
    }

    public callURI(isEdit?: boolean) {
        const link = document.createElement('a');
        link.href = this.getFullURI(isEdit);
        link.click();
        link.remove();
    }

}
