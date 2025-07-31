/* eslint-disable @unicorn/no-unused-properties */
/* eslint-disable @tseslint/no-non-null-assertion */
/* eslint-disable @tseslint/unbound-method */
import { TestBed } from '@angular/core/testing';
import { type TreeNode, type Data } from '../types';
import { NodeService } from './node.service';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { MatTree } from '@angular/material/tree';
import { environment } from '../../environments/environment';

describe('NodeService', () => {
  let service: NodeService;
  let httpClient: HttpTestingController;

  const mockData: Data = {
    Interface: 'menu.load',
    NodeToLoad: 'R10ALL00',
    Result: true,
    children: [
      {
        text: 'Stammdatenverwaltung',
        iconCls: 'stamm.ico',
        children: [],
      },
    ],
  };
  const mockData2: Data = {
    Interface: 'menu.load',
    NodeToLoad: 'R10ALL00',
    Result: true,
    children: [
      {
        text: 'Nonex',
        iconCls: 'stamm.ico',
        children: [
          {
            text: 'Nonex le ouf',
            iconCls: 'navigator_16.ico',
            children: [
              {
                text: 'Nonex cornflex',
                call: 'R10AB01001',
                iconCls: 'prosoz_16.ico',
              },
            ],
          },
        ],
      },
      {
        text: 'Pilex CornFlex',
        iconCls: 'AUFTRAG.ico',
        children: [
          {
            text: 'Pilex',
            iconCls: 'navigator_16.ico',
            children: [
              {
                text: 'Pilex la flex',
                call: 'R10AB01001',
                iconCls: 'prosoz_16.ico',
              },
            ],
          },
        ],
      },
    ],
  };
  const treeData: TreeNode[] = [
    {
      text: 'Parent 1',
      iconCls: '',
      children: [
        {
          text: 'Child Match',
          children: [],
          iconCls: '',
        },
        {
          text: 'Another Child',
          children: [],
          iconCls: '',
        },
      ],
    },
    {
      text: 'Parent 2',
      iconCls: '',
      children: [
        {
          text: 'Deep Parent',
          iconCls: '',
          children: [
            {
              text: 'Deep Match',
              children: [],
              iconCls: '',
            },
          ],
        },
      ],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NodeService);
    httpClient = TestBed.inject(HttpTestingController);
  });

  it('expandMatchingNodes expands correct ancestors for matching nodes', () => {
    const mockTree: MatTree<TreeNode> = {
      expand: jasmine.createSpy('expand'),
    } as unknown as MatTree<TreeNode>;

    service.expandMatchingNodes(treeData, 'match', mockTree, []);
    // Check that it expanded correct ancestors
    expect(mockTree.expand).toHaveBeenCalledTimes(3);
    expect(mockTree.expand).toHaveBeenCalledWith(treeData[0]);
    expect(mockTree.expand).toHaveBeenCalledWith(treeData[1]);
    expect(mockTree.expand).toHaveBeenCalledWith(treeData[1].children![0]);
  });
  it('isNodeMatch is working correctly', () => {
    const mockNode: TreeNode = {
      text: 'test',
      iconCls: '',
      children: [],
    };

    expect(service.isNodeMatch(mockNode, 'test1')).toBeFalsy();
    expect(service.isNodeMatch(mockNode, 'test')).toBeTruthy();
  });
  it('filterNonMatchingLeafs is filtering the correct nodes', () => {
    const ouf: TreeNode[] = service.filterNonMatchingLeafs(mockData2.children, 'Pilex');

    expect(ouf.length).toBe(1);
    expect(ouf[0].text).toBe('Pilex CornFlex');
    expect(ouf[0].children?.[0].text).toBe('Pilex');
    expect(ouf[0].children?.[0].children?.[0].text).toBe('Pilex la flex');
  });
});
