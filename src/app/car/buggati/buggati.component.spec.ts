import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuggatiComponent } from './buggati.component';

describe('BuggatiComponent', () => {
  let component: BuggatiComponent;
  let fixture: ComponentFixture<BuggatiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuggatiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuggatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
