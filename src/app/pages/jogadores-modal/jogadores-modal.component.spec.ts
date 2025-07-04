import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JogadoresModalComponent } from './jogadores-modal.component';

describe('JogadoresModalComponent', () => {
  let component: JogadoresModalComponent;
  let fixture: ComponentFixture<JogadoresModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JogadoresModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JogadoresModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
