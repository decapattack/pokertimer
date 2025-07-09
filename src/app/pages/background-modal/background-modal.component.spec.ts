import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundModalComponent } from './background-modal.component';

describe('BackgroundModalComponent', () => {
  let component: BackgroundModalComponent;
  let fixture: ComponentFixture<BackgroundModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
