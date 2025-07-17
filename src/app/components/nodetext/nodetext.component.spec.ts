import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NodetextComponent } from './nodetext.component';

describe('NodetextComponent', () => {
  let component: NodetextComponent;
  let fixture: ComponentFixture<NodetextComponent>;

  const mockNode = {
    text: 'Stammdatenverwaltung',
    iconCls: 'stamm.ico',
    children: [
      {
        text: 'Kundenstamm',
        call: 'R10ST00001',
        iconCls: 'prosoz_16.ico',
        leaf: true,
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [NodetextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NodetextComponent);
    component = fixture.componentInstance;
    component.node = mockNode;
    component.searchValue = 'pilex';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
