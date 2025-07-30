import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeComponent } from './tree.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { NodeService } from '../../services/node.service';
import { of } from 'rxjs';
import { type Data } from '../../types';
import { DebugElement } from '@angular/core';

describe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;
  let nodeService: jasmine.SpyObj<NodeService>;

  const mockData: Data = {
    Interface: 'menu.load',
    NodeToLoad: 'R10ALL00',
    Result: true,
    children: [
      {
        text: 'Stammdatenverwaltung',
        iconCls: 'stamm.ico',
        children: [
          {
            text: 'Kundenstamm',
            call: 'R10ST00001',
            iconCls: 'prosoz_16.ico',
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    nodeService = jasmine.createSpyObj(
      'NodeService',
      [
        'getInitialData',
        'expandMatchingNodes',
        'isNodeMatch',
        'filterNonMatchingLeafs',
        'showContextMenu',
        'hideContextMenu',
        'setFavoriteFlag',
      ],
      {
        contextMenuState$: of({
          visible: false,
          node: null,
          position: { x: 0, y: 0 },
        }),
      },
    ) as jasmine.SpyObj<NodeService>;
    nodeService.getInitialData.and.returnValue(of(mockData));
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        {
          provide: NodeService,
          useValue: nodeService,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*   it('ngOnChange is correctly behaving based on the searchValue', () => {
    component.searchValue = 'abc';

    // Create a spy object for MatTree with collapseAll and toggle methods
    const mockTreeCollapseAll = jasmine.createSpyObj<MatTree<node>>('MatTree', ['collapseAll']);

    // Assign mockTreeCollapseAll to component.tree because expandMatchingNodes uses component.tree internally
    component.tree = mockTreeCollapseAll;

    // Spy on nodeService.expandMatchingNodes, NOT component method (assuming it's a service method)
    // If expandMatchingNodes is a component method, spyOn(component, 'expandMatchingNodes') is correct
    spyOn(nodeService, 'expandMatchingNodes').and.callThrough();
    nodeService.filterNonMatchingLeafs.and.returnValue(mockData.children);
    component.initialData = mockData.children;
    component.dataSource = mockData.children;

    const changes: Changes = {
      searchValue: {
        currentValue: 'abc',
        previousValue: '',
        firstChange: false,
        isFirstChange: () => false,
      },
    };

    component.ngOnChanges(changes);
    // Check if expandMatchingNodes was called with expected arguments
    expect(nodeService.expandMatchingNodes).toHaveBeenCalledWith(
      mockData.children,
      'abc',
      mockTreeCollapseAll,
      [],
    );
    component.searchValue = '';

    const secondChange: Changes = {
      searchValue: {
        currentValue: '',
        previousValue: 'abc',
        firstChange: false,
        isFirstChange: () => false,
      },
    };

    component.ngOnChanges(secondChange);
    // Check if collapseAll was called on tree
    expect(mockTreeCollapseAll.collapseAll).toHaveBeenCalled();
  }); */
  it('Tree component is correctly rendered', () => {
    const tree: DebugElement = fixture.debugElement.query(By.css('mat-tree'));
    const treeNode: DebugElement = fixture.debugElement.query(By.css('mat-tree-node'));
    const appNode: DebugElement = fixture.debugElement.query(By.css('app-node'));

    expect(tree).toBeTruthy();
    expect(treeNode).toBeTruthy();
    expect(appNode).toBeTruthy();
  });
  it('Data is correctly fetched on Init', () => {
    component.ngOnInit();
    expect(component.initialData).toEqual(mockData.children);
    expect(component.dataSource).toEqual(mockData.children);
  });
});
