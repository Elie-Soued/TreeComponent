import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { SearchbarComponent } from './components/searchbar/searchbar.component';

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
    const searchBar: DebugElement = fixture.debugElement.query(By.css('app-searchbar'));
    const tree: DebugElement = fixture.debugElement.query(By.css('app-tree'));

    expect(searchBar).toBeTruthy();
    expect(tree).toBeTruthy();
  });
  it('searchValue is correctly updated', fakeAsync(() => {
    const searchBarDebugElement: DebugElement = fixture.debugElement.query(By.css('app-searchbar'));
    const searchBarComponent: SearchbarComponent =
      searchBarDebugElement.componentInstance as SearchbarComponent;

    searchBarComponent.searchValue.emit('pilex');
    tick();
    fixture.detectChanges();
    expect(component.searchValue).toEqual('pilex');
  }));
});
