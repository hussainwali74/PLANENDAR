import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuzukiComponent } from './suzuki.component';

describe('SuzukiComponent', () => {
  let component: SuzukiComponent;
  let fixture: ComponentFixture<SuzukiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuzukiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuzukiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
