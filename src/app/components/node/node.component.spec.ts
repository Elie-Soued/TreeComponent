import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeComponent } from './node.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NodeService } from '../../services/node.service';
import { FavoritesService } from '../../services/favorites.service';
import { MatTree } from '@angular/material/tree';
import { type node } from '../../types';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of, Subject } from 'rxjs';

describe('NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;
  let nodeService: jasmine.SpyObj<NodeService>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;
  let mockTree: jasmine.SpyObj<MatTree<node>>;
  let favoritePopupSubject: BehaviorSubject<any>;
  let enableFavoriteNode: Subject<any>;

  const mockNode = {
    text: 'Stammdatenverwaltung',
    iconCls: 'stamm.ico',
    children: [
      {
        text: 'Kundenstamm',
        call: 'R10ST00001',
        iconCls: 'prosoz_16.ico',
        leaf: true,
      },
    ],
  };

  beforeEach(async () => {
    favoritePopupSubject = new BehaviorSubject({
      visible: false,
      node: null,
      position: { x: 0, y: 0 },
    });

    enableFavoriteNode = new Subject();

    nodeService = jasmine.createSpyObj('NodeService', ['isNodeMatch']);
    favoritesService = jasmine.createSpyObj('FavoritesService', [
      'showFavoritePopup',
      'closeFavoritePopup',
    ]);

    favoritesService.FavoritePopup$ = favoritePopupSubject.asObservable();
    favoritesService.enableFavoriteNode$ = favoritePopupSubject.asObservable();

    mockTree = jasmine.createSpyObj<MatTree<node>>('MatTree', [
      'isExpanded',
      'toggle',
    ]);

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

  it('Render a node', () => {
    const button = fixture.debugElement.query(By.css('#nodeBtn'));
    const icon = fixture.debugElement.query(By.css('#nodeIcon'));
    const span = fixture.debugElement.query(By.css('app-nodetext'));

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

    const button = fixture.debugElement.query(By.css('#leafBtn'));
    const span = fixture.debugElement.query(By.css('app-nodetext'));
    expect(button).toBeTruthy();
    expect(span).toBeTruthy();
  });

  it('Expand node', () => {
    component.node = mockNode;
    component.isLeaf = false;
    const button = fixture.debugElement.query(By.css('#nodeBtn')).nativeElement;
    button.click();
    expect(mockTree.toggle).toHaveBeenCalled();
  });

  it('display the favorite popup', () => {
    // Arrange
    const mockEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 100,
      clientY: 200,
    });
    const span = fixture.debugElement.query(By.css('app-nodetext'));

    //Action
    span.triggerEventHandler('contextmenu', mockEvent);
    favoritePopupSubject.next({
      visible: true,
      node: mockNode,
      position: { x: 100, y: 200 },
    });

    fixture.detectChanges();

    //Arrange
    const favoritePopup = fixture.debugElement.query(By.css('.favoriten'));

    // Assert
    expect(favoritePopup).toBeTruthy();
    expect(favoritesService.showFavoritePopup).toHaveBeenCalledWith(mockNode, {
      x: 100,
      y: 200,
    });
  });
});
