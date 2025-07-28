/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import {
  type node,
  type ContextMenuAction,
  type position,
  type popup_state,
  type actionTypes,
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
  @Input() node!: node;

  @Output() menuAction: EventEmitter<ContextMenuAction> = new EventEmitter<ContextMenuAction>();

  favoritePopupIsVisible: boolean = false;

  favoritePopupPosition: position = { x: 0, y: 0 };

  draggedPosition: position = { x: 0, y: 0 };

  private favoritePopupSubscription: Subscription | undefined;

  private draggedPositionSubscription: Subscription | undefined;

  isLeftClick: boolean = false;

  constructor(
    private favoriteService: FavoritesService,
    private dragService: DragService,
  ) {}

  ngOnInit(): void {
    this.favoritePopupSubscription = this.favoriteService.FavoritePopup$.subscribe(
      (state: popup_state) => {
        this.favoritePopupIsVisible = state.visible && state.node === this.node;
        this.favoritePopupPosition = state.position;
        this.isLeftClick = state.isLeftClick;
      },
    );
    this.draggedPositionSubscription = this.dragService.shareDraggedPosition$.subscribe(
      (position: position) => {
        this.draggedPosition = position;
      },
    );
  }

  onMenuAction(type: actionTypes, isRoot: boolean = false): void {
    this.menuAction.emit({
      type,
      node: this.node,
      isRoot,
    });
  }

  ngOnDestroy(): void {
    this.favoritePopupSubscription?.unsubscribe();
    this.draggedPositionSubscription?.unsubscribe();
  }
}
