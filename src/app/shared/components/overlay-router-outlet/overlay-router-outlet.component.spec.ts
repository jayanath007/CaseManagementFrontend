import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayRouterOutletComponent } from './overlay-router-outlet.component';

describe('OverlayRouterOutletComponent', () => {
  let component: OverlayRouterOutletComponent;
  let fixture: ComponentFixture<OverlayRouterOutletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlayRouterOutletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayRouterOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
