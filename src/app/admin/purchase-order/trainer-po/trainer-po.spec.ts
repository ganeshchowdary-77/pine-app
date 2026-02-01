import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerPo } from './trainer-po';

describe('TrainerPo', () => {
  let component: TrainerPo;
  let fixture: ComponentFixture<TrainerPo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerPo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerPo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
