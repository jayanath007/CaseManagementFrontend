import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export class ComponentBase implements OnDestroy {

    protected destroy$ = new Subject();
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
