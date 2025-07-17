import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodetextComponent } from './nodetext.component';

describe('NodetextComponent', () => {
  let component: NodetextComponent;
  let fixture: ComponentFixture<NodetextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodetextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodetextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
