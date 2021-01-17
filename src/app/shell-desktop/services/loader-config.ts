import { SystemJsPopupLoaderService } from './system-js-popup-loader.service';

export class LoaderConfig {
    constructor(private modulePath: string, private loader: SystemJsPopupLoaderService,
        public width: string = 'auto', public height: string = 'auto') { }

    public load() {
        return this.loader.loadModule(this.modulePath);
    }
}
