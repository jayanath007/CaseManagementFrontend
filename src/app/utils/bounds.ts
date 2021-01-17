
export function centerToWindow(w: number, h: number) {

    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : (screen as any).left;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : (screen as any).top;

    const width = window.innerWidth ? window.innerWidth :
        document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight :
        document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    const left = ((width / 2) - (w / 2)) + dualScreenLeft;
    const top = ((height / 2) - (h / 2)) + dualScreenTop;
    return { width: w, height: h, top: Math.floor(top), left: Math.floor(left) };
}

export function fitWindow(maxWidth: number = 1200, maxHeight: number = null) {
    if (maxHeight == null) {
        maxHeight = screen.availHeight - 200;
    } else {
        maxHeight = Math.min(maxHeight, screen.availHeight - 200);
    }

    if (maxWidth == null) {
        maxWidth = screen.availWidth - 200;
    } else {
        maxWidth = Math.min(maxWidth, screen.availWidth - 200);
    }

    return centerToWindow(maxWidth, maxHeight);
}
