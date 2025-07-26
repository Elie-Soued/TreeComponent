/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Component, Input, HostListener, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { type node, type ContextMenuAction } from '../../types';
import { MatTree } from '@angular/material/tree';
import { NodetextComponent } from '../nodetext/nodetext.component';
import { FavoritesService } from '../../services/favorites.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [MatIconModule, NodetextComponent, ContextMenuComponent],
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements OnInit, OnDestroy {
  @Input() isLeaf: boolean = false;

  @Input() node!: node;

  @Input() searchValue: string | null = null;

  @Input() tree!: MatTree<node>;

  isEnabled: boolean = false;

  private originalNode: string = '';

  private enableFavoriteNodeSubscription: Subscription | undefined;

  constructor(private favoriteService: FavoritesService) {}

  ngOnInit(): void {
    this.enableFavoriteNodeSubscription = this.favoriteService.enableFavoriteNode$.subscribe(
      (node: node) => {
        if (node === this.node) {
          this.isEnabled = true;
        }
      },
    );
  }

  toggleNode(node: node): void {
    this.tree.toggle(node);
  }

  onRightClick(e: MouseEvent): void {
    e.preventDefault();
    this.favoriteService.showFavoritePopup(this.node, {
      x: e.clientX,
      y: e.clientY,
    });
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
      this.favoriteService.renameNodeInFavorites(this.originalNode, this.node.text);
    }

    this.isEnabled = false;
  }

  private addNodeToFavorite(node: node): void {
    node.favorite = true;
    this.favoriteService.addNodeToFavorites(node);
  }

  private createFolderInFavorite(node: node, isRoot: boolean = false): void {
    this.favoriteService.createNewFolder(node, UtilsService.getTimeStamp(), isRoot);
  }

  private removeNodeFromFavorite(node: node): void {
    node.favorite = false;
    this.favoriteService.removeNodeFromFavorites(node);
  }

  private enableInput(node: node): void {
    this.originalNode = JSON.stringify(node);
    this.favoriteService.enableNodeText(node);
  }

  onMenuAction(action: ContextMenuAction): void {
    switch (action.type) {
      case 'addToFavorites': {
        this.addNodeToFavorite(action.node);

        break;
      }

      case 'removeFromFavorites': {
        this.removeNodeFromFavorite(action.node);

        break;
      }

      case 'createFolder': {
        this.createFolderInFavorite(action.node, action.isRoot ?? false);

        break;
      }

      case 'enableInput': {
        this.enableInput(action.node);

        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.enableFavoriteNodeSubscription?.unsubscribe();
  }
}
