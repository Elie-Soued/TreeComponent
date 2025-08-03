/* eslint-disable @tseslint/explicit-module-boundary-types */
/* eslint-disable @tseslint/explicit-function-return-type */
/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Component, Input, HostListener, ElementRef, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { type TreeNode, type ContextMenuAction } from '../../types';
import { MatTree } from '@angular/material/tree';
import { NodeLabelComponent } from '../nodelabel/nodelabel.component';
import { FavoritesService } from '../../services/favorites.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { DragService } from '../../services/drag.service';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [MatIconModule, NodeLabelComponent, ContextMenuComponent],
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent {
  @Input() isLeaf: boolean = false;

  @Input() node!: TreeNode;

  @Input() searchValue: string | null = null;

  @Input() tree!: MatTree<TreeNode>;

  isEnabled: boolean = false;

  enabledNodeId: string | undefined = '';

  private favoriteService: FavoritesService = inject(FavoritesService);

  private dragService: DragService = inject(DragService);

  private elementRef: ElementRef<HTMLElement> = inject(
    ElementRef<HTMLElement>,
  ) as ElementRef<HTMLElement>;

  enableNode(nodeId: string | undefined) {
    if (this.node.id === nodeId) {
      this.isEnabled = true;
    }
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

    this.favoriteService.popUp.set({
      visible: true,
      node: this.node,
      position: {
        x: e.clientX,
        y: e.clientY,
      },
      isLeftClick,
    });
  }

  @HostListener('document:click')
  hideFavorites(): void {
    this.favoriteService.popUp.set({
      visible: false,
      node: null,
      position: { x: 0, y: 0 },
      isLeftClick: false,
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isEnabled = false;
    this.favoriteService.popUp.set({
      visible: false,
      node: null,
      position: { x: 0, y: 0 },
      isLeftClick: false,
    });
  }

  @HostListener('document:keydown.enter')
  onEnter(): void {
    if (this.isEnabled) {
      this.favoriteService.renameNode();
    }

    this.isEnabled = false;
  }

  onMenuAction(action: ContextMenuAction): void {
    switch (action.type) {
      case 'addToFavorites': {
        this.favoriteService.addNode(action.node);

        break;
      }

      case 'removeFromFavorites': {
        this.favoriteService.removeNode(action.node);

        break;
      }

      case 'createFolder': {
        this.favoriteService.createNewFolder(action.node, action.isRoot ?? false);

        break;
      }

      case 'enableInput': {
        this.enableNode(action.node.id);

        break;
      }
    }
  }
}
