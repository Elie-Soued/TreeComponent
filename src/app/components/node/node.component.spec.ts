import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeComponent } from './node.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NodeService } from '../../services/node.service';
import { FavoritesService } from '../../services/favorites.service';
import { MatTree } from '@angular/material/tree';
import { type TreeNode, type ContextMenuClickDetails } from '../../types';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { DebugElement } from '@angular/core';

describe('NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;
  let nodeService: jasmine.SpyObj<NodeService>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;
  let mockTree: jasmine.SpyObj<MatTree<TreeNode>>;
  let favoritePopupSubject: BehaviorSubject<ContextMenuClickDetails>;

  const mockNode: TreeNode = {
    text: 'Stammdatenverwaltung',
    iconCls: 'stamm.ico',
    children: [
      {
        text: 'Kundenstamm',
        call: 'R10ST00001',
        iconCls: 'prosoz_16.ico'
      }
    ]
  };
  const initialPopupState: ContextMenuClickDetails = {
    visible: false,
    node: null,
    position: { x: 0, y: 0 },
    isLeftClick: false
  };

  beforeEach(async () => {
    favoritePopupSubject = new BehaviorSubject(initialPopupState);
    favoritesService = jasmine.createSpyObj('FavoritesService', [
      'showPopup',
      'closePopup'
    ]) as jasmine.SpyObj<FavoritesService>;
    mockTree = jasmine.createSpyObj<MatTree<TreeNode>>('MatTree', [ 'isExpanded', 'toggle' ]);
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        {
          provide: NodeService,
          useValue: nodeService
        },
        {
          provide: FavoritesService,
          useValue: favoritesService
        }
      ],
      imports: [ NodeComponent ]
    }).compileComponents();
    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;
    component.isLeaf = false;
    component.node = mockNode;
    component.tree = mockTree;
    component.searchValue = 'pilex';
    fixture.detectChanges();
  });
  it('Expand node', () => {
    component.node = mockNode;
    component.isLeaf = false;

    const toggleSpy: jasmine.Spy = spyOn(component, 'toggleNode');
    // eslint-disable-next-line prettier/prettier
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('#nodeBtn'))
      .nativeElement as HTMLButtonElement;

    button.click();
    expect(toggleSpy).toHaveBeenCalled();
  });
  it('Render a node', () => {
    const button: DebugElement = fixture.debugElement.query(By.css('#nodeBtn'));
    const icon: DebugElement = fixture.debugElement.query(By.css('#nodeIcon'));
    const span: DebugElement = fixture.debugElement.query(By.css('app-nodelabel'));

    expect(button).toBeTruthy();
    expect(span).toBeTruthy();
    expect(icon).toBeTruthy();
  });
  it('Render a leaf', () => {
    component.node = {
      text: 'Kundenstamm',
      iconCls: 'prosoz_16.ico'
    };
    component.isLeaf = true;
    fixture.detectChanges();

    const button: DebugElement = fixture.debugElement.query(By.css('#leafBtn'));
    const span: DebugElement = fixture.debugElement.query(By.css('app-nodelabel'));

    expect(button).toBeTruthy();
    expect(span).toBeTruthy();
  });
  it('display the favorite popup', () => {
    // Arrange
    const mockEvent: Event = new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 100,
      clientY: 200
    });
    const span: DebugElement = fixture.debugElement.query(By.css('app-nodelabel'));

    // Action
    span.triggerEventHandler('contextmenu', mockEvent);
    favoritePopupSubject.next({
      visible: true,
      node: mockNode,
      position: { x: 100, y: 200 },
      isLeftClick: false
    });
    fixture.detectChanges();

    // Arrange
    const favoritePopup: DebugElement = fixture.debugElement.query(By.css('.tree-node'));

    // Assert
    expect(favoritePopup).toBeTruthy();
  });
});
