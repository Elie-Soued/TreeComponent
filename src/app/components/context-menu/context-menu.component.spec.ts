import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextMenuComponent } from './context-menu.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ provideHttpClient(), provideHttpClientTesting() ],
      imports: [ ContextMenuComponent ]
    }).compileComponents();
    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
