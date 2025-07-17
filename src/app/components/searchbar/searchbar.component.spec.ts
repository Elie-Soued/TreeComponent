import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { SearchbarComponent } from './searchbar.component';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAnimations()],
      imports: [SearchbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('searchBar Component is correctly rendered', () => {
    const form = fixture.debugElement.query(By.css('form'));
    const formField = fixture.debugElement.query(By.css('mat-form-field'));
    const label = fixture.debugElement.query(By.css('label'));
    const input = fixture.debugElement.query(By.css('input'));

    expect(form).toBeTruthy();
    expect(formField).toBeTruthy();
    expect(input).toBeTruthy();
    expect(label).toBeTruthy();
  });

  it('searchBar correctly emits a searchValue', fakeAsync(() => {
    //Prepare
    const emitSpy = spyOn(component.searchValue, 'emit');
    component.ngOnInit();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    //Act
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();

    //Trigger
    expect(emitSpy).toHaveBeenCalledWith('test');
  }));

  it('clear form is clearing the searchControl', fakeAsync(() => {
    const clearSpy = spyOn(component, 'clearForm');

    const clearBtn = fixture.debugElement.query(
      By.css('#clearBtn')
    ).nativeElement;

    clearBtn.click();

    expect(clearSpy).toHaveBeenCalled();
    expect(component.searchControl.value).toEqual('');
  }));
});
