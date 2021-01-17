import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'screenEditIcon',
    pure: true
})
export class ScreenEditPipe implements PipeTransform {

    transform(value: any): any {
        switch (this.getScreenEditIconName(value)) {
            case 'txt':
                return 'text_fields';
            case 'cbo':
                return 'list';
            case 'tpg':
                return 'tab';
            case 'dte':
                return 'date_range';
            case 'chk':
                return 'check_box';
            case 'lbl':
                return 'label';
            case 'een': // screen
                return 'chrome_reader_mode';
            case 'ent': // client
                return 'people';
            case 'ter': // matter
                return 'work_outline';
            case 'cmd':
                return 'announcement';
            case 'grd':
                return 'grid_on';
            case 'grp':
                return 'rounded_corner';
            case 'opt':
                return 'radio_button_checked';
            // case 'bnk':
            //     return 'people';
            // case 'opn':
            //     return 'people';
            // case 'cls':
            //     return 'class';
            // case 'art':
            //     return 'people';
            // case 'top':
            //     return 'people';
            // case 'frm':
            //     return 'people';
            default:
                return 'perm_device_information';
        }
    }

    getScreenEditIconName(value: string) {
        const firstTypes = ['BNK', 'OPN', 'CLS', 'ART', 'TOP', 'FRM'];
        const subs1: string = value.substring(0, 3).toUpperCase();
        if (firstTypes.indexOf(subs1) !== -1) {
            return subs1.toLowerCase();
        }
        return value.substring(3, 6);
    }

}
