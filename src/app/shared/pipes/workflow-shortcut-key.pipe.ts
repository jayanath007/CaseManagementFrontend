import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'workflowShortCutKey',
    pure: true
})
export class WorkflowShortCutKeyPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            switch (value) {
                case 112:
                    return 'F1';
                case 113:
                    return 'F2';
                case 114:
                    return 'F3';
                case 115:
                    return 'F4';
                case 116:
                    return 'F5';
                case 117:
                    return 'F6';
                case 118:
                    return 'F7';
                case 119:
                    return 'F8';
                case 120:
                    return 'F9';
                case 121:
                    return 'F10';
                case 122:
                    return 'F11';
                case 123:
                    return 'F12';
                case 124:
                    return 'F13';
                case 125:
                    return 'F14';
                default:
                    return '-';
            }
        }
        return '-';
    }

}
