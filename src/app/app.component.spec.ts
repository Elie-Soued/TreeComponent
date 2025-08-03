import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { SearchinputComponent } from './components/searchinput/searchinput.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('The App component is correctly rendered', () => {
    const searchinput: DebugElement = fixture.debugElement.query(By.css('app-searchinput'));
    const tree: DebugElement = fixture.debugElement.query(By.css('app-tree'));

    expect(searchinput).toBeTruthy();
    expect(tree).toBeTruthy();
  });
  it('searchValue is correctly updated', fakeAsync(() => {
    const searchinputDebugElement: DebugElement = fixture.debugElement.query(
      By.css('app-searchinput'),
    );
    const searchinputComponent: SearchinputComponent =
      searchinputDebugElement.componentInstance as SearchinputComponent;

    searchinputComponent.searchValue.emit('pilex');
    tick();
    fixture.detectChanges();
    expect(component.searchValue).toEqual('pilex');
  }));
});
