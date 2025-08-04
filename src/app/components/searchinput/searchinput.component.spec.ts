import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SearchInputComponent } from './searchinput.component';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';

describe('SearchbarComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ provideAnimations() ],
      imports: [ SearchInputComponent ]
    }).compileComponents();
    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('searchBar Component is correctly rendered', () => {
    const formField: DebugElement = fixture.debugElement.query(By.css('mat-form-field'));
    const label: DebugElement = fixture.debugElement.query(By.css('label'));
    const input: DebugElement = fixture.debugElement.query(By.css('input'));

    expect(formField).toBeTruthy();
    expect(input).toBeTruthy();
    expect(label).toBeTruthy();
  });
  it('searchBar correctly emits a searchValue', fakeAsync(() => {
    // Prepare
    const emitSpy: jasmine.Spy = spyOn(component.searchValue, 'emit');

    component.ngOnInit();

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;
    // Act

    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();
    // Trigger
    expect(emitSpy).toHaveBeenCalledWith('test');
  }));
  it('clear form is clearing the searchControl', fakeAsync(() => {
    const clearSpy: jasmine.Spy = spyOn(component, 'clearForm');
    const clearBtn: HTMLElement = fixture.debugElement.query(By.css('#clearBtn'))
      .nativeElement as HTMLElement;

    clearBtn.click();
    expect(clearSpy).toHaveBeenCalled();
    expect(component.searchControl.value).toEqual('');
  }));
});
