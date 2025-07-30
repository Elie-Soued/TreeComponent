/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { NodeService } from '../../services/node.service';
import { NodeComponent } from '../node/node.component';
import { type Data, type TreeNode } from '../../types';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [MatTreeModule, NodeComponent, CommonModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
})
export class TreeComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
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

  private updateTreeSubscription: Subscription | undefined;

  constructor(
    private nodeService: NodeService,
    private favoriteService: FavoritesService,
  ) {}

  ngOnInit(): void {
    this.loadTree();
    this.updateTreeSubscription = this.favoriteService.updateTree$.subscribe(
      (nodes: TreeNode[]) => {
        this.updateTree(nodes);
      },
    );
  }

  loadTree(): void {
    this.nodeService.getInitialData().subscribe((response: Data) => {
      const favoriteDirectory: TreeNode | undefined = response.children.find(
        (n: TreeNode) => n.text === 'Favoriten',
      );

      if (favoriteDirectory) {
        favoriteDirectory.favorite = true;
      }

      const favoriteNodes: TreeNode[] | undefined = response.children.find(
        (n: TreeNode) => n.text === 'Favoriten',
      )?.children;

      if (favoriteNodes) {
        this.nodeService.setFavoriteFlag(favoriteNodes);
      }

      this.initialData = response.children;
      this.dataSource = response.children;
    });
  }

  private updateTree(nodes: TreeNode[]): void {
    const favoritesNode: TreeNode | undefined = this.dataSource.find(
      (n: TreeNode) => n.text === 'Favoriten',
    );

    if (favoritesNode) {
      this.nodeService.setFavoriteFlag(nodes);
      favoritesNode.children = nodes;
      this.dataSource = [...this.dataSource];
      this.initialData = [...this.dataSource];
    } else {
      this.dataSource.push({
        text: 'Favoriten',
        children: [...nodes],
        iconCls: '',
      });
      this.dataSource = [...this.dataSource];
      this.initialData = [...this.dataSource];
    }
  }

  ngAfterViewInit(): void {
    this.isTreeReady = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const searchValueChanged: boolean = !changes['searchValue'].firstChange && this.isTreeReady;
    const searchValueIsEmpty: boolean = !this.searchValue || this.searchValue === '';
    const searchValueIsTooShort: boolean =
      // eslint-disable-next-line no-implicit-coercion
      !!this.searchValue && this.searchValue.length < this.minimunSearchCharacter;

    if (searchValueChanged) {
      if (searchValueIsEmpty || searchValueIsTooShort) {
        this.dataSource = this.initialData;
        this.tree.collapseAll();
      } else {
        const filteredNodes: TreeNode[] = this.nodeService.filterNonMatchingLeafs(
          this.dataSource,
          // eslint-disable-next-line @tseslint/no-non-null-assertion
          this.searchValue!,
        );

        this.dataSource = filteredNodes;
        // eslint-disable-next-line @tseslint/no-non-null-assertion
        this.nodeService.expandMatchingNodes(this.dataSource, this.searchValue!, this.tree, []);
      }
    }
  }

  ngOnDestroy(): void {
    this.updateTreeSubscription?.unsubscribe();
  }
}
