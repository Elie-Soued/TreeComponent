/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { NodeService } from '../../services/node.service';
import { NodeComponent } from '../node/node.component';
import { type TreeNode } from '../../types';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [MatTreeModule, NodeComponent, CommonModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
})
export class TreeComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('tree') tree!: MatTree<TreeNode>;

  @Input() searchValue: string | null = '';

  dataSource: TreeNode[] = [];

  initialData: TreeNode[] = [];

  isTreeReady: boolean = false;

  minimunSearchCharacter: number = 3;

  // eslint-disable-next-line @tseslint/explicit-function-return-type, @tseslint/explicit-module-boundary-types, @tseslint/class-methods-use-this
  childrenAccessor = (node: TreeNode) => node.children ?? [];

  // eslint-disable-next-line @tseslint/explicit-function-return-type, @tseslint/explicit-module-boundary-types, @tseslint/class-methods-use-this
  hasChild = (_: number, node: TreeNode) =>
    Boolean(node.children) && node.children && node.children.length > 0;

  constructor(
    private nodeService: NodeService,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.dataService.loadInitialData().subscribe();
    this.updateTreeData();
  }

  ngAfterViewInit(): void {
    this.isTreeReady = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const searchValueChanged: boolean = !changes['searchValue'].firstChange && this.isTreeReady;

    if (searchValueChanged) {
      this.filterTree();
    }
  }

  private updateTreeData(): void {
    this.dataService.treeData$.subscribe((data: TreeNode[]) => {
      const favoritesNode: TreeNode | undefined = data.find(
        (node: TreeNode) => node.text === 'Favoriten',
      );

      if (favoritesNode) {
        this.tree.expand(favoritesNode);
      }

      this.initialData = [...data];
      this.dataSource = [...data];
    });
  }

  private filterTree(): void {
    if (!this.searchValue || this.searchValue.length < this.minimunSearchCharacter) {
      this.dataSource = [...this.initialData];
      this.tree.collapseAll();
    } else {
      const filteredNodes: TreeNode[] = this.nodeService.filterNonMatchingLeafs(
        this.initialData,
        this.searchValue,
      );

      this.dataSource = filteredNodes;
      this.nodeService.expandMatchingNodes(this.dataSource, this.searchValue, this.tree, []);
    }
  }
}
