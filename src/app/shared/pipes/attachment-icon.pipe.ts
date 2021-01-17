import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'attachmentIcon',
    pure: true
})
export class AttachmentIconPipe implements PipeTransform {

    transform(value: string, args?: 'type'): string {
        if (args && value) {
            const type = value.split('.');
            return type[type.length - 1];
        }
        if (value) {
            const type = value.split('.');
            switch (type[type.length - 1].toLowerCase()) {
                case 'png':
                    return 'fa fa-file-image-o dps-file-icon';
                case 'jpg':
                    return 'fa fa-file-image-o dps-file-icon';
                case 'jpeg':
                    return 'fa fa-file-image-o dps-file-icon';
                case 'gif':
                    return 'fa fa-file-image-o dps-file-icon';

                case 'tif':
                    return 'fa fa-file-o dps-file-icon dps-tif';
                case 'tiff':
                    return 'fa fa-file-o dps-file-icon dps-tiff';
                case 'rtf':
                    return 'fa fa-file-o dps-file-icon dps-rtf';

                case 'txt':
                    return 'fa fa-file-text-o dps-file-icon';

                case 'doc':
                    return 'fa fa-file-word-o dps-file-icon';
                case 'docx':
                    return 'fa fa-file-word-o dps-file-icon';
                case 'docm':
                    return 'fa fa-file-word-o dps-file-icon';
                case 'docb':
                    return 'fa fa-file-word-o dps-file-icon';
                case 'dot':
                    return 'fa fa-file-word-o dps-file-icon';
                case 'dotx':
                    return 'fa fa-file-word-o dps-file-icon';
                case 'dotm':
                    return 'fa fa-file-word-o dps-file-icon';
                case 'wbk':
                    return 'fa fa-file-word-o dps-file-icon';
                case 'odt':
                    return 'fa fa-file-word-o dps-file-icon';

                case 'ppt':
                    return 'fa fa-file-powerpoint-o dps-file-icon';
                case 'pptx':
                    return 'fa fa-file-powerpoint-o dps-file-icon';
                case 'pptm':
                    return 'fa fa-file-powerpoint-o dps-file-icon';
                case 'pot':
                    return 'fa fa-file-powerpoint-o dps-file-icon';
                case 'potx':
                    return 'fa fa-file-powerpoint-o dps-file-icon';
                case 'potm':
                    return 'fa fa-file-powerpoint-o dps-file-icon';
                case 'pps':
                    return 'fa fa-file-powerpoint-o dps-file-icon';
                case 'ppsx':
                    return 'fa fa-file-powerpoint-o dps-file-icon';
                case 'ppsm':
                    return 'fa fa-file-powerpoint-o dps-file-icon';
                case 'ppam':
                    return 'fa fa-file-powerpoint-o dps-file-icon';
                case 'sldx':
                    return 'fa fa-file-powerpoint-o dps-file-icon';
                case 'sldm':
                    return 'fa fa-file-powerpoint-o dps-file-icon';

                case 'xls':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'xlsx':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'xlsm':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'xlt':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'xltx':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'xltm':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'xlm':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'xlsb':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'xla':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'xlam':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'xll':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'xlw':
                    return 'fa fa-file-excel-o dps-file-icon';
                case 'csv':
                    return 'fa fa-file-excel-o dps-file-icon';

                case 'pdf':
                    return 'fa fa-file-pdf-o dps-file-icon';

                case 'rar':
                    return 'fa fa-file-archive-o dps-file-icon';
                case 'zip':
                    return 'fa fa-file-archive-o dps-file-icon';

                case 'html':
                    return 'fa fa-file-code-o dps-file-icon';
                case 'htm':
                    return 'fa fa-file-code-o dps-file-icon';
                case 'mdb':
                    return 'fa fa-file-code-o dps-file-icon';
                case 'json':
                    return 'fa fa-file-code-o dps-file-icon';
                case 'c':
                    return 'fa fa-file-code-o dps-file-icon';
                case 'cs':
                    return 'fa fa-file-code-o dps-file-icon';
                case 'js':
                    return 'fa fa-file-code-o dps-file-icon';
                case 'css':
                    return 'fa fa-file-code-o dps-file-icon';
                case 'xml':
                    return 'fa fa-file-code-o dps-file-icon';

                case 'msg':
                    return 'fa fa-envelope-o dps-file-icon';
                case 'eml':
                    return 'fa fa-envelope-o dps-file-icon';

                case 'mp3':
                    return 'fa fa-file-audio-o dps-file-icon';
                case '3gp':
                    return 'fa fa-file-audio-o dps-file-icon';
                case 'm4p':
                    return 'fa fa-file-audio-o dps-file-icon';
                case 'wma':
                    return 'fa fa-file-audio-o dps-file-icon';
                case 'wav':
                    return 'fa fa-file-audio-o dps-file-icon';

                case 'mp4':
                    return 'fa fa-file-video-o dps-file-icon';
                case 'avi':
                    return 'fa fa-file-video-o dps-file-icon';
                case 'wmv':
                    return 'fa fa-file-video-o dps-file-icon';
                case 'mkv':
                    return 'fa fa-file-video-o dps-file-icon';

                case 'url':
                    return 'fa fa-link dps-file-icon';

                default:
                    return 'fa fa-file-o dps-file-icon';
            }
        }
        return 'dps-empty-file';
    }

}
