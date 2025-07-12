import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeComponent } from './tree.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Tree component is correctly rendered', () => {
    // write test
  });

  it('Data is correctly fetched on Init', () => {
    // write test
  });

  it('onSearchChange is triggered onChange', () => {
    // write test
  });

  it('Tree is ready after ViewInit', () => {
    // write test
  });
});
