import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPo } from './client-po';

describe('ClientPo', () => {
  let component: ClientPo;
  let fixture: ComponentFixture<ClientPo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientPo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
