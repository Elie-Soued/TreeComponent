import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NodetextComponent } from './nodetext.component';
import { By } from '@angular/platform-browser';

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

  it('Normal text is displayed when no searchValue is entered', () => {
    component.searchValue = '';
    fixture.detectChanges();
    const noMatchParagraph = fixture.debugElement.query(
      By.css('#noMatch')
    ).nativeElement;

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

    const matchParagraph = fixture.debugElement.query(
      By.css('#match')
    ).nativeElement;
    expect(matchParagraph).toBeTruthy();

    const before = fixture.debugElement.query(By.css('#before')).nativeElement;
    const matchedText = fixture.debugElement.query(
      By.css('#matchedText')
    ).nativeElement;
    const after = fixture.debugElement.query(By.css('#after')).nativeElement;

    expect(before.innerText).toBe('Stamm');
    expect(matchedText.innerText).toBe('daten');
    expect(matchedText.classList.contains('match')).toBeTrue();
    expect(after.innerText).toBe('verwaltung');
  });
});
