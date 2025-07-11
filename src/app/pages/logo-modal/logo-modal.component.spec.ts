import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoModalComponent } from './logo-modal.component';

describe('LogoModalComponent', () => {
  let component: LogoModalComponent;
  let fixture: ComponentFixture<LogoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
