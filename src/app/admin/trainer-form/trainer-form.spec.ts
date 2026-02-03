import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerForm } from './trainer-form';

describe('TrainerForm', () => {
  let component: TrainerForm;
  let fixture: ComponentFixture<TrainerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
