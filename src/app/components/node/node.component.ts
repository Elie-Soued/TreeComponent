import { Component, Input, HostListener, OnInit } from '@angular/core';
import { NodeService } from '../../services/node.service';
import { MatIconModule } from '@angular/material/icon';
import { type node } from '../../types';
import { MatTree } from '@angular/material/tree';
import { NodetextComponent } from '../nodetext/nodetext.component';
import { NgStyle } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [MatIconModule, NodetextComponent, NgStyle, FavoriteButtonComponent],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss',
})
export class NodeComponent implements OnInit {
  @Input() isLeaf: boolean = false;
  @Input() node!: node;
  @Input() searchValue: string | null = null;
  @Input() tree!: MatTree<node>;

  favoritePopupIsVisible = false;
  favoritePopupPosition = { x: 0, y: 0 };
  selectedNode: node | null = null;
  isEnabled = false;
  originalNode = '';

  constructor(
    public nodeService: NodeService,
    private favoriteService: FavoritesService
  ) {}

  ngOnInit() {
    this.favoriteService.enableFavoriteNode$.subscribe((node) => {
      if (node === this.node) {
        this.isEnabled = true;
      }
    });

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
    this.isEnabled = false;
    this.favoriteService.closeFavoritePopup();
  }

  @HostListener('document:keydown.enter')
  onEnter() {
    if (this.isEnabled) {
      this.favoriteService.renameNodeInFavorites(
        this.originalNode,
        this.node.text
      );
    }

    this.isEnabled = false;
  }

  addToFavorite(node: node) {
    node.favorite = true;
    this.favoriteService.addNodeToFavorites(node);
  }

  removeFromFavorite(node: node) {
    node.favorite = false;
    this.favoriteService.removeNodeFromFavorites(node);
  }

  enableInput(node: node) {
    this.originalNode = JSON.stringify(node);
    this.favoriteService.enableNodeText(node);
  }

  addNewFolder(node: node) {}
}
