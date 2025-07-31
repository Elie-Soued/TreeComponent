import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeComponent } from './node.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NodeService } from '../../services/node.service';
import { FavoritesService } from '../../services/favorites.service';
import { MatTree } from '@angular/material/tree';
import { type TreeNode, type PopupState } from '../../types';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { DebugElement } from '@angular/core';

describe('NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;
  let nodeService: jasmine.SpyObj<NodeService>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;
  let mockTree: jasmine.SpyObj<MatTree<TreeNode>>;
  let favoritePopupSubject: BehaviorSubject<PopupState>;
  let enableFavoriteNode: Subject<TreeNode>;

  const mockNode: TreeNode = {
    text: 'Stammdatenverwaltung',
    iconCls: 'stamm.ico',
    children: [
      {
        text: 'Kundenstamm',
        call: 'R10ST00001',
        iconCls: 'prosoz_16.ico',
      },
    ],
  };
  const initialPopupState: PopupState = {
    visible: false,
    node: null,
    position: { x: 0, y: 0 },
    isLeftClick: false,
  };

  beforeEach(async () => {
    favoritePopupSubject = new BehaviorSubject(initialPopupState);
    enableFavoriteNode = new Subject();
    favoritesService = jasmine.createSpyObj('FavoritesService', [
      'showFavoritePopup',
      'closeFavoritePopup',
    ]) as jasmine.SpyObj<FavoritesService>;
    favoritesService.FavoritePopup$ = favoritePopupSubject.asObservable();
    favoritesService.enableFavoriteNode$ = enableFavoriteNode.asObservable();
    mockTree = jasmine.createSpyObj<MatTree<TreeNode>>('MatTree', ['isExpanded', 'toggle']);
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        {
          provide: NodeService,
          useValue: nodeService,
        },
        {
          provide: FavoritesService,
          useValue: favoritesService,
        },
      ],
      imports: [NodeComponent],
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
    const span: DebugElement = fixture.debugElement.query(By.css('app-nodetext'));

    expect(button).toBeTruthy();
    expect(span).toBeTruthy();
    expect(icon).toBeTruthy();
  });
  it('Render a leaf', () => {
    component.node = {
      text: 'Kundenstamm',
      iconCls: 'prosoz_16.ico',
    };
    component.isLeaf = true;
    fixture.detectChanges();

    const button: DebugElement = fixture.debugElement.query(By.css('#leafBtn'));
    const span: DebugElement = fixture.debugElement.query(By.css('app-nodetext'));

    expect(button).toBeTruthy();
    expect(span).toBeTruthy();
  });
  it('display the favorite popup', () => {
    // Arrange
    const mockEvent: Event = new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 100,
      clientY: 200,
    });
    const span: DebugElement = fixture.debugElement.query(By.css('app-nodetext'));

    // Action
    span.triggerEventHandler('contextmenu', mockEvent);
    favoritePopupSubject.next({
      visible: true,
      node: mockNode,
      position: { x: 100, y: 200 },
      isLeftClick: false,
    });
    fixture.detectChanges();

    // Arrange
    const favoritePopup: DebugElement = fixture.debugElement.query(By.css('.favoriten'));

    // Assert
    expect(favoritePopup).toBeTruthy();
    // eslint-disable-next-line @tseslint/unbound-method
    expect(favoritesService.showFavoritePopup).toHaveBeenCalledWith(
      mockNode,
      {
        x: 100,
        y: 200,
      },
      false,
    );
  });
});
