import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NodelabelComponent } from './nodelabel.component';
import { By } from '@angular/platform-browser';
import { type TreeNode } from '../../types';

describe('NodelabelComponent', () => {
  let component: NodelabelComponent;
  let fixture: ComponentFixture<NodelabelComponent>;

  const mockNode: TreeNode = {
    text: 'Stammdatenverwaltung',
    iconCls: 'stamm.ico',
    children: [
      {
        text: 'Kundenstamm',
        call: 'R10ST00001',
        iconCls: 'prosoz_16.ico',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [NodelabelComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(NodelabelComponent);
    component = fixture.componentInstance;
    component.node = mockNode;
    component.searchValue = 'pilex';
    fixture.detectChanges();
  });
  it('Normal text is displayed when no searchValue is entered', () => {
    component.searchValue = '';
    fixture.detectChanges();

    const noMatchParagraph: HTMLElement = fixture.debugElement.query(By.css('#noMatch'))
      .nativeElement as HTMLElement;

    expect(noMatchParagraph).toBeTruthy();
  });
  it('Letters are highlighted when there is a match', () => {
    component.searchValue = 'daten';
    component.node = {
      text: 'Stammdatenverwaltung',
      iconCls: 'stamm.ico',
      children: [],
    };
    component.ngOnInit();
    fixture.detectChanges();

    const matchParagraph: HTMLElement = fixture.debugElement.query(By.css('#match'))
      .nativeElement as HTMLElement;

    expect(matchParagraph).toBeTruthy();

    const before: HTMLElement = fixture.debugElement.query(By.css('#before'))
      .nativeElement as HTMLElement;
    const matchedText: HTMLElement = fixture.debugElement.query(By.css('#matchedText'))
      .nativeElement as HTMLElement;
    const after: HTMLElement = fixture.debugElement.query(By.css('#after'))
      .nativeElement as HTMLElement;

    expect(before.textContent).toBe('Stamm');
    expect(matchedText.textContent).toBe('daten');
    expect(matchedText.classList.contains('node-text__segment')).toBeTrue();
    expect(after.textContent).toBe('verwaltung');
  });
});
