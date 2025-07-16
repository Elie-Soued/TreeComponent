import { TestBed } from '@angular/core/testing';
import { type node } from './node.service';
import { NodeService } from './node.service';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MatTree } from '@angular/material/tree';

describe('NodeService', () => {
  let service: NodeService;
  let httpClient: HttpTestingController;
  let mockData = {
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

  const treeData: node[] = [
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

  it('getInitialData is working correctly', () => {
    service.getInitialData().subscribe((data) => {
      expect(data).toEqual(mockData);
    });
    const req = httpClient.expectOne('menu.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('expandMatchingNodes expands correct ancestors for matching nodes', () => {
    const mockTree = {
      expand: jasmine.createSpy('expand'),
    } as unknown as MatTree<node>;

    service.expandMatchingNodes(treeData, 'match', [], mockTree);

    // Check that it expanded correct ancestors
    expect(mockTree.expand).toHaveBeenCalledTimes(3);
    expect(mockTree.expand).toHaveBeenCalledWith(treeData[0]); // for 'Child Match'
    expect(mockTree.expand).toHaveBeenCalledWith(treeData[1]); // for 'Deep Match'
    expect(mockTree.expand).toHaveBeenCalledWith(treeData[1].children![0]); // 'Deep Parent'
  });

  it('isNodeMatch is working correctly', () => {
    const mockNode = {
      text: 'test',
      iconCls: '',
      children: [],
    };

    expect(service.isNodeMatch(mockNode, 'test1')).toBeFalsy();
    expect(service.isNodeMatch(mockNode, 'test')).toBeTruthy();
  });
});
