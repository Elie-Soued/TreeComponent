import {
  Component,
  Input,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { type node } from '../../types';
import { MatTree } from '@angular/material/tree';
import { NodetextComponent } from '../nodetext/nodetext.component';
import { FavoritesService } from '../../services/favorites.service';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [MatIconModule, NodetextComponent, FavoriteButtonComponent],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss',
})
export class NodeComponent implements OnInit, OnDestroy {
  @Input() isLeaf: boolean = false;
  @Input() node!: node;
  @Input() searchValue: string | null = null;
  @Input() tree!: MatTree<node>;

  favoritePopupIsVisible = false;
  favoritePopupPosition = { x: 0, y: 0 };
  isEnabled = false;

  private originalNode = '';
  private favoritePopupSubscription: Subscription | undefined;
  private enableFavoriteNodeSubscription: Subscription | undefined;

  constructor(private favoriteService: FavoritesService) {}

  ngOnInit(): void {
    this.enableFavoriteNodeSubscription =
      this.favoriteService.enableFavoriteNode$.subscribe((node) => {
        if (node === this.node) {
          this.isEnabled = true;
        }
      });

    this.favoritePopupSubscription =
      this.favoriteService.FavoritePopup$.subscribe((state) => {
        this.favoritePopupIsVisible = state.visible && state.node === this.node;
        this.favoritePopupPosition = state.position;
      });
  }

  toggleNode(node: node): void {
    this.tree.toggle(node);
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.favoriteService.showFavoritePopup(this.node, {
      x: event.clientX,
      y: event.clientY,
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
      this.favoriteService.renameNodeInFavorites(
        this.originalNode,
        this.node.text
      );
    }

    this.isEnabled = false;
  }

  addNodeToFavorite(node: node): void {
    node.favorite = true;
    this.favoriteService.addNodeToFavorites(node);
  }

  createFolderInFavorite(node: node, isRoot = false): void {
    this.favoriteService.createNewFolder(node, this.getTimeStamp(), isRoot);
  }

  removeNodeFromFavorite(node: node): void {
    node.favorite = false;
    this.favoriteService.removeNodeFromFavorites(node);
  }

  enableInput(node: node): void {
    this.originalNode = JSON.stringify(node);
    this.favoriteService.enableNodeText(node);
  }

  private getTimeStamp(): string {
    const now = new Date();
    return now
      .toISOString()
      .replace(/[-:T.Z]/g, '')
      .slice(2, 14);
  }

  ngOnDestroy(): void {
    this.favoritePopupSubscription?.unsubscribe();
    this.enableFavoriteNodeSubscription?.unsubscribe();
  }
}
