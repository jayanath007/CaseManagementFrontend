// all wopi stuff depricated
export const wopiExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'csv', 'rtf', 'ods', 'xlsb', 'xlsm', 'one', 'onetoc2',
    'odp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'pptm',
    'wbx',
    'docm', 'dot', 'dotm', 'odt'
];

export const wopiEditExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf'];
export const wopiConvertExtensions = ['doc', 'xls', 'ppt'];

export const driveEditableExtension = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf'];

export const browserCompatibleExtensions = ['pdf', 'html', 'txt', 'svg', 'mp4', 'mp3'];
export const imageExtensions = ['png', 'gif', 'jpg', 'jpeg'];
export const msgExtensions = ['msg', 'eml'];

export const directDownloadExtensions = ['png', 'gif', 'jpg', 'jpeg', 'html', 'txt', 'svg', 'xml'];
export const directViewExtentions = ['png', 'gif', 'jpg', 'jpeg', 'html', 'pdf', 'svg', 'ico'];

export const v3CanViewExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'csv', 'rtf', 'ods', 'xlsb', 'xlsm', 'one', 'onetoc2',
    'odp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'pptm',
    // 'wbx',
    'docm', 'dot', 'dotm', 'odt',
    'png', 'gif', 'jpg', 'jpeg', 'html', 'pdf', 'svg', 'ico', 'txt', 'htm', 'mp3', 'xml', 'mp4'];

export const blacklistExtention = ['php', 'php3', 'php4', 'phtml', 'exe', 'js', 'bad', 'msi'];

export const harmfullFileForView = ['php', 'php3', 'php4', 'phtml', 'exe', 'js', 'bad', 'msi', 'html'];

export const allSupportedExtentions = wopiExtensions.concat(browserCompatibleExtensions, imageExtensions, msgExtensions, ['xml', 'eml']);
