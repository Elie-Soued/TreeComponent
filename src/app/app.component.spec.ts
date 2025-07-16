import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('The App component is correctly rendered', () => {
    const searchBar = fixture.debugElement.query(By.css('app-searchbar'));
    const tree = fixture.debugElement.query(By.css('app-tree'));
    expect(searchBar).toBeTruthy();
    expect(tree).toBeTruthy();
  });

  it('searchValue is correctly updated', fakeAsync(() => {
    const searchBarDebugElement = fixture.debugElement.query(
      By.css('app-searchbar')
    );
    const searchBarComponent = searchBarDebugElement.componentInstance;

    searchBarComponent.searchValue.emit('pilex');
    tick();
    fixture.detectChanges();

    expect(component.searchValue).toEqual('pilex');
  }));
});
