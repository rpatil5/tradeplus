import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tradeplus } from './tradeplus';

describe('Tradeplus', () => {
  let component: Tradeplus;
  let fixture: ComponentFixture<Tradeplus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tradeplus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tradeplus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
