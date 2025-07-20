import { Component, Input, HostListener } from '@angular/core';
import { NodeService } from '../../services/node.service';
import { MatIconModule } from '@angular/material/icon';
import { type node } from '../../types';
import { MatTree } from '@angular/material/tree';
import { NodetextComponent } from '../nodetext/nodetext.component';
import { NgStyle } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [MatIconModule, NodetextComponent, NgStyle],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss',
})
export class NodeComponent {
  @Input() isLeaf: boolean = false;
  @Input() node!: node;
  @Input() searchValue: string | null = null;
  @Input() tree!: MatTree<node>;

  favoritePopupIsVisible = false;
  favoritePopupPosition = { x: 0, y: 0 };
  selectedNode: node | null = null;

  constructor(
    public nodeService: NodeService,
    private favoriteService: FavoritesService
  ) {
    this.favoriteService.FavoritePopup$.subscribe((state) => {
      this.favoritePopupIsVisible = state.visible && state.node === this.node;
      this.favoritePopupPosition = state.position;
    });
  }

  toggleNode(node: node): void {
    this.tree.toggle(node);
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.favoriteService.showFavoritePopup(this.node, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  @HostListener('document:click')
  hideFavorites() {
    this.favoriteService.closeFavoritePopup();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.favoriteService.closeFavoritePopup();
  }
}
