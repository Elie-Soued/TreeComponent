import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeComponent } from './tree.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { NodeService } from '../../services/node.service';
import { of } from 'rxjs';
import { type node } from '../../types';
import { MatTree } from '@angular/material/tree';

describe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;
  let nodeService: jasmine.SpyObj<NodeService>;

  const mockData = {
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
            leaf: true,
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
      ],
      {
        contextMenuState$: of({
          visible: false,
          node: null,
          position: { x: 0, y: 0 },
        }),
      }
    );

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

  it('Tree component is correctly rendered', () => {
    const tree = fixture.debugElement.query(By.css('mat-tree'));
    const treeNode = fixture.debugElement.query(By.css('mat-tree-node'));
    const appNode = fixture.debugElement.query(By.css('app-node'));

    expect(tree).toBeTruthy();
    expect(treeNode).toBeTruthy();
    expect(appNode).toBeTruthy();
  });

  it('Data is correctly fetched on Init', () => {
    component.ngOnInit();
    expect(component.initialData).toEqual(mockData.children);
    expect(component.dataSource).toEqual(mockData.children);
  });

  it('ngOnChange is correctly behaving based on the searchValue', () => {
    component.searchValue = 'abc';

    const mockTree = jasmine.createSpyObj<MatTree<node>>('MatTree', [
      'collapseAll',
    ]);
    component.tree = mockTree;

    component.ngAfterViewInit();
    nodeService.filterNonMatchingLeafs.and.returnValue(mockData.children);
    component.initialData = mockData.children;
    component.dataSource = mockData.children;

    const changes = {
      searchValue: {
        currentValue: 'abc',
        previousValue: '',
        firstChange: false,
        isFirstChange: () => false,
      },
    };

    component.ngOnChanges(changes);

    expect(nodeService.expandMatchingNodes).toHaveBeenCalledWith(
      mockData.children,
      'abc',
      [],
      mockTree
    );

    component.searchValue = '';

    const secondChange = {
      searchValue: {
        currentValue: '',
        previousValue: 'abc',
        firstChange: false,
        isFirstChange: () => false,
      },
    };

    component.ngOnChanges(secondChange);

    expect(component.tree.collapseAll).toHaveBeenCalled();
  });
});
