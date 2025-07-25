import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteButtonComponent } from './favorite-button.component';

describe('FavoriteButtonComponent', () => {
  let component: FavoriteButtonComponent;
  let fixture: ComponentFixture<FavoriteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteButtonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FavoriteButtonComponent);
    component = fixture.componentInstance;
    component.position = { y: 0, x: 0 };
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
