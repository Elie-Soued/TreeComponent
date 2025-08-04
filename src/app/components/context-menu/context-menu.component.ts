
import { Component, Input, Output, EventEmitter, inject, effect } from '@angular/core';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import {
  type TreeNode,
  type ContextMenuAction,
  type Position,
  type ContextMenuClickDetails,
  type ContextMenuActionTypes
} from '../../types';
import { FavoritesService } from '../../services/favorites.service';
import { DragService } from '../../services/drag.service';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [ FavoriteButtonComponent ],
  templateUrl: './context-menu.component.html',
  styleUrls: [ './context-menu.component.scss' ]
})
export class ContextMenuComponent {
  @Input() node!: TreeNode;

  @Output() menuAction: EventEmitter<ContextMenuAction> = new EventEmitter<ContextMenuAction>();

  favoritePopupIsVisible: boolean = false;

  favoritePopupPosition: Position = { x: 0, y: 0 };

  draggedPosition: Position = { x: 0, y: 0 };

  private favoriteService: FavoritesService = inject(FavoritesService);

  private dragService: DragService = inject(DragService);

  isLeftClick: boolean | null = false;

  constructor () {
    effect(() => {
      const { node, position, isLeftClick, visible }: ContextMenuClickDetails
        = this.favoriteService.popUp();

      this.favoritePopupIsVisible = visible && node === this.node;
      this.favoritePopupPosition = position;
      this.isLeftClick = isLeftClick;
      this.draggedPosition = this.dragService.draggedPosition();
    });
  }

  onMenuAction (type: ContextMenuActionTypes, isRoot: boolean = false): void {
    this.menuAction.emit({
      type,
      node: this.node,
      isRoot
    });
  }
}
