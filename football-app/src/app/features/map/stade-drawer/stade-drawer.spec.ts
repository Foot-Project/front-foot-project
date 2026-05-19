import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadeDrawerComponent } from './stade-drawer.component';

describe('StadeDrawer', () => {
  let component: StadeDrawerComponent;
  let fixture: ComponentFixture<StadeDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadeDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StadeDrawerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
