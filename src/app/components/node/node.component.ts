/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Component, Input, HostListener, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { type TreeNode, type ContextMenuAction } from '../../types';
import { MatTree } from '@angular/material/tree';
import { NodetextComponent } from '../nodetext/nodetext.component';
import { FavoritesService } from '../../services/favorites.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { DragService } from '../../services/drag.service';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [MatIconModule, NodetextComponent, ContextMenuComponent],
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements OnInit, OnDestroy {
  @Input() isLeaf: boolean = false;

  @Input() node!: TreeNode;

  @Input() searchValue: string | null = null;

  @Input() tree!: MatTree<TreeNode>;

  isEnabled: boolean = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private favoriteService: FavoritesService,
    private dragService: DragService,
    private elementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.favoriteService.enableFavoriteNode$.subscribe((node: TreeNode) => {
        if (node === this.node) {
          this.isEnabled = true;
        }
      }),
    );
  }

  toggleNode(node: TreeNode): void {
    this.tree.toggle(node);
  }

  sendPosition(e: MouseEvent, preventDefault: boolean, isLeftClick: boolean): void {
    // To avoid triggering the mousedown event when right clicking

    if (e.type === 'mousedown' && e.button === 2) {
      return;
    }

    if (preventDefault) {
      e.preventDefault();
    }

    if (isLeftClick && this.node.favorite) {
      if (this.node.text === 'Favoriten') {
        this.tree.toggle(this.node);

        return;
      }

      const treeReference: HTMLElement | null = this.elementRef.nativeElement.closest('mat-tree');

      if (treeReference) {
        this.dragService.startDrag(e, this.node, this.elementRef.nativeElement, treeReference);
      }
    }

    this.favoriteService.showFavoritePopup(
      this.node,
      {
        x: e.clientX,
        y: e.clientY,
      },
      isLeftClick,
    );
  }

  @HostListener('document:click')
  hideFavorites(): void {
    this.favoriteService.closeFavoritePopup();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isEnabled = false;
    this.favoriteService.closeFavoritePopup();
  }

  @HostListener('document:keydown.enter')
  onEnter(): void {
    if (this.isEnabled) {
      this.favoriteService.renameNodeInFavorites();
    }

    this.isEnabled = false;
  }

  onMenuAction(action: ContextMenuAction): void {
    switch (action.type) {
      case 'addToFavorites': {
        this.favoriteService.addNodeToFavorites(action.node);

        break;
      }

      case 'removeFromFavorites': {
        this.favoriteService.removeNodeFromFavorites(action.node);

        break;
      }

      case 'createFolder': {
        this.favoriteService.createNewFolder(action.node, action.isRoot ?? false);

        break;
      }

      case 'enableInput': {
        this.favoriteService.enableNodeText(action.node);

        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
