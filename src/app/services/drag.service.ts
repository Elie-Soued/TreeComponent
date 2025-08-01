/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Injectable } from '@angular/core';
import { type Position, type TreeNode } from '../types';
import { BehaviorSubject, Observable } from 'rxjs';
import { FavoritesService } from './favorites.service';

@Injectable({
  providedIn: 'root',
})
export class DragService {
  isDragging: boolean = false;

  dragStartPosition: Position = { x: 0, y: 0 };

  currentMousePosition: Position = { x: 0, y: 0 };

  draggedNode: TreeNode | null = null;

  elementOffset: Position = { x: 0, y: 0 };

  private shareDraggedPosition: BehaviorSubject<Position> = new BehaviorSubject<Position>({
    x: 0,
    y: 0,
  });

  private treeElement!: HTMLElement;

  private boundaries: { left: number; top: number; right: number; bottom: number } | null = null;

  private isOverFavorite: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private isFavorite: boolean = false;

  shareDraggedPosition$: Observable<Position> = this.shareDraggedPosition.asObservable();

  isOverFavorite$: Observable<boolean> = this.isOverFavorite.asObservable();

  constructor(private favoriteService: FavoritesService) {}

  startDrag(e: MouseEvent, node: TreeNode, draggedElement: HTMLElement, tree: HTMLElement): void {
    this.isDragging = true;
    this.draggedNode = node;
    this.treeElement = tree;

    const rect: DOMRect = draggedElement.getBoundingClientRect();
    const rectTree: DOMRect = this.treeElement.getBoundingClientRect();

    this.elementOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    this.boundaries = {
      left: rectTree.left,
      top: rectTree.top,
      right: rectTree.right - rect.width,
      bottom: rectTree.bottom - rect.height,
    };
    this.dragStartPosition = { x: rect.left, y: rect.top };
    this.currentMousePosition = {
      x: e.clientX - this.elementOffset.x,
      y: e.clientY - this.elementOffset.y,
    };
    this.shareDraggedPosition.next(this.currentMousePosition);
    this.checkFavoriteHover(e);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.body.style.userSelect = 'none';
  }

  onMouseMove = (e: MouseEvent): void => {
    if (!this.isDragging || !this.boundaries) return;

    let newX: number = e.clientX - this.elementOffset.x;
    let newY: number = e.clientY - this.elementOffset.y;

    newX = Math.max(this.boundaries.left, Math.min(this.boundaries.right, newX));
    newY = Math.max(this.boundaries.top, Math.min(this.boundaries.bottom, newY));
    this.currentMousePosition = { x: newX, y: newY };
    this.shareDraggedPosition.next(this.currentMousePosition);
    this.checkFavoriteHover(e);
  };

  onMouseUp = (e: MouseEvent): void => {
    if (!this.isDragging) return;

    this.handleDrop(e);
    this.isDragging = false;
    this.draggedNode = null;
    this.isOverFavorite.next(false);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.body.style.userSelect = '';
  };

  private checkFavoriteHover(e: MouseEvent): void {
    const elementBelow: Element | null = document.elementFromPoint(e.clientX, e.clientY);
    const favoriteElement: Element | null | undefined = elementBelow?.closest('.favorite');

    this.isFavorite = Boolean(favoriteElement);
    this.isOverFavorite.next(this.isFavorite);
  }

  handleDrop(e: MouseEvent): void {
    const elementBelow: Element | null = document.elementFromPoint(e.clientX, e.clientY);
    const dropTarget: Element | null | undefined = elementBelow?.closest('app-node');

    if (dropTarget) {
      const inputElement: Element | null = dropTarget.querySelector('input[ng-reflect-model]');

      if (inputElement) {
        const nodeValue: string | null = inputElement.getAttribute('ng-reflect-model');

        if (this.isFavorite && this.draggedNode) {
          this.favoriteService.dropNode(this.draggedNode, nodeValue);
        }
      }
    }
  }
}
