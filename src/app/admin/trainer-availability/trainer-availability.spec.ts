import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerAvailability } from './trainer-availability';

describe('TrainerAvailability', () => {
  let component: TrainerAvailability;
  let fixture: ComponentFixture<TrainerAvailability>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerAvailability]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerAvailability);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
