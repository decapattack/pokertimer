import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipcountModalComponent } from './chipcount-modal.component';

describe('ChipcountModalComponent', () => {
  let component: ChipcountModalComponent;
  let fixture: ComponentFixture<ChipcountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipcountModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChipcountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
