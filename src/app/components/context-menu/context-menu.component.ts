/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import {
  type TreeNode,
  type ContextMenuAction,
  type Position,
  type PopupState,
  type ActionTypes,
} from '../../types';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';
import { DragService } from '../../services/drag.service';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [FavoriteButtonComponent],
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent implements OnInit, OnDestroy {
  @Input() node!: TreeNode;

  @Output() menuAction: EventEmitter<ContextMenuAction> = new EventEmitter<ContextMenuAction>();

  favoritePopupIsVisible: boolean = false;

  favoritePopupPosition: Position = { x: 0, y: 0 };

  draggedPosition: Position = { x: 0, y: 0 };

  private subscriptions: Subscription = new Subscription();

  private favoriteService: FavoritesService = inject(FavoritesService);

  private dragService: DragService = inject(DragService);

  isLeftClick: boolean = false;

  ngOnInit(): void {
    this.subscriptions.add(
      this.favoriteService.popUp$.subscribe((state: PopupState) => {
        this.favoritePopupIsVisible = state.visible && state.node === this.node;
        this.favoritePopupPosition = state.position;
        this.isLeftClick = state.isLeftClick;
      }),
    );
    this.subscriptions.add(
      this.dragService.shareDraggedPosition$.subscribe((position: Position) => {
        this.draggedPosition = position;
      }),
    );
  }

  onMenuAction(type: ActionTypes, isRoot: boolean = false): void {
    this.menuAction.emit({
      type,
      node: this.node,
      isRoot,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
