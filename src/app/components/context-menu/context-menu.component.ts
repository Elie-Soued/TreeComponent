import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { type node, type ContextMenuAction, type position, type popup_state } from '../../types';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [FavoriteButtonComponent],
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent implements OnInit, OnDestroy {
  @Input() node!: node;

  @Output() menuAction: EventEmitter<ContextMenuAction> = new EventEmitter<ContextMenuAction>();

  favoritePopupIsVisible: boolean = false;

  favoritePopupPosition: position = { x: 0, y: 0 };

  private favoritePopupSubscription: Subscription | undefined;

  constructor(private favoriteService: FavoritesService) {}

  ngOnInit(): void {
    this.favoritePopupSubscription = this.favoriteService.FavoritePopup$.subscribe(
      (state: popup_state) => {
        this.favoritePopupIsVisible = state.visible && state.node === this.node;
        this.favoritePopupPosition = state.position;
      },
    );
  }

  onAddToFavorites(): void {
    this.menuAction.emit({
      type: 'addToFavorites',
      node: this.node,
    });
  }

  onRemoveFromFavorites(): void {
    this.menuAction.emit({
      type: 'removeFromFavorites',
      node: this.node,
    });
  }

  onCreateFolder(isRoot: boolean): void {
    this.menuAction.emit({
      type: 'createFolder',
      node: this.node,
      isRoot,
    });
  }

  onEnableInput(): void {
    this.menuAction.emit({
      type: 'enableInput',
      node: this.node,
    });
  }

  ngOnDestroy(): void {
    this.favoritePopupSubscription?.unsubscribe();
  }
}
