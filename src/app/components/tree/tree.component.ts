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
import { type data, type node } from '../../types';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [MatTreeModule, NodeComponent],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
})
export class TreeComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @ViewChild('tree') tree!: MatTree<node>;
  @Input() searchValue: string | null = '';
  dataSource: node[] = [];
  initialData: node[] = [];
  isTreeReady = false;
  minimunSearchCharacter = 3;
  childrenAccessor = (node: node) => node.children ?? [];
  hasChild = (_: number, node: node) =>
    !!node.children && node.children.length > 0;

  private updateTreeSubscription: Subscription | undefined;

  constructor(
    private nodeService: NodeService,
    private favoriteService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadTree();
    this.updateTreeSubscription = this.favoriteService.updateTree$.subscribe(
      (nodes) => {
        this.updateTree(nodes);
      }
    );
  }

  loadTree(): void {
    this.nodeService.getInitialData().subscribe((response: data) => {
      const favoriteNodes = response.children.find(
        (n) => n.text === 'Favoriten'
      )?.children;

      if (favoriteNodes) {
        this.nodeService.setFavoriteFlag(favoriteNodes);
      }

      this.initialData = response.children;
      this.dataSource = response.children;
    });
  }

  private updateTree(nodes: node[]): void {
    const favoritesNode = this.dataSource.find((n) => n.text === 'Favoriten');
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
    const searchValueChanged =
      changes['searchValue'] &&
      !changes['searchValue'].firstChange &&
      this.isTreeReady;

    const searchValueIsEmpty = !this.searchValue || this.searchValue === '';
    const searchValueIsTooShort =
      this.searchValue && this.searchValue.length < this.minimunSearchCharacter;

    if (searchValueChanged) {
      if (searchValueIsEmpty || searchValueIsTooShort) {
        this.dataSource = this.initialData;
        this.tree.collapseAll();
      } else {
        const filteredNodes = this.nodeService.filterNonMatchingLeafs(
          this.dataSource,
          this.searchValue!
        );

        this.dataSource = filteredNodes;

        this.nodeService.expandMatchingNodes(
          this.dataSource,
          this.searchValue!,
          [],
          this.tree
        );
      }
    }
  }

  ngOnDestroy() {
    this.updateTreeSubscription?.unsubscribe();
  }
}
