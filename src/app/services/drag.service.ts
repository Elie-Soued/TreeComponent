/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Injectable, Renderer2, RendererFactory2, WritableSignal, inject, signal } from '@angular/core';
import { type Position, type TreeNode } from '../types';
import { FavoritesService } from './favorites.service';


@Injectable({
  providedIn: 'root'
})
export class DragService {
  /**
   * It is the value that needs to be substracted from the absolute position of the cursor to ensure a smooth dragging.
   * Without the offset, the dragged element will jump to the cursor's position while dragging (bad UI)
   */
  private elementOffset: Position = { x: 0, y: 0 };

  /**
   * Limits of the dragged element so it doesn't go beyond the tree
   */
  private boundaries: { left: number; top: number; right: number; bottom: number; } | null = null;

  /**
   * Absolute mouse position on the screen minus the elementOffset
   */
  private currentElementPosition: Position = { x: 0, y: 0 };

  /**
   * Sharing the element position using signals
   */
  draggedPosition: WritableSignal<Position> = signal(this.currentElementPosition);

  /**
   * Informing other components if the dragged element is above a favorite element (aka if there is an acceptable dropzone)
   */
  overFavorite: WritableSignal<boolean> = signal<boolean>(false);

  private isDragging: boolean = false;

  private draggedNode: TreeNode | null = null;

  private isFavorite: boolean = false;

  private tree!: HTMLElement;

  private favoriteService: FavoritesService = inject(FavoritesService);

  private renderer: Renderer2;

  constructor (private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }


  startDrag (e: MouseEvent, node: TreeNode, draggedElement: HTMLElement, tree: HTMLElement): void {
    // Initiate the drag
    this.isDragging = true;
    this.draggedNode = node;
    this.tree = tree;
    // Set boundaries and position
    this.getElementPosition(e, draggedElement);
    this.getBoundaries(draggedElement);
    this.draggedPosition.set(this.currentElementPosition);
    this.checkFavoriteHover(e);
    // Add event listeners
    this.renderer.listen('document', 'mousemove', this.onMouseMove);
    this.renderer.listen('document', 'mouseup', this.onMouseUp);
    this.renderer.setStyle(document.body, 'user-select', 'none');
  }

  onMouseMove = (e: MouseEvent): void => {
    if (!this.isDragging || !this.boundaries) return;

    // Recalculate the element's positioning on the move
    let newX: number = e.clientX - this.elementOffset.x;
    let newY: number = e.clientY - this.elementOffset.y;

    // Making sure the position doesn't go beyond the boundaries
    newX = Math.max(this.boundaries.left, Math.min(this.boundaries.right, newX));
    newY = Math.max(this.boundaries.top, Math.min(this.boundaries.bottom, newY));
    // Share the position with exterior elements
    this.currentElementPosition = { x: newX, y: newY };
    this.draggedPosition.set(this.currentElementPosition);
    this.checkFavoriteHover(e);
  };

  onMouseUp = (e: MouseEvent): void => {
    if (!this.isDragging) return;

    this.handleDrop(e);
    this.isDragging = false;
    this.draggedNode = null;
    this.overFavorite.set(false);
    this.renderer.listen('document', 'mousemove', this.onMouseMove);
    this.renderer.listen('document', 'mouseup', this.onMouseUp);
    this.renderer.setStyle(document.body, 'user-select', '');
  };


  private handleDrop (e: MouseEvent): void {
    const elementBelow: Element | null = document.elementFromPoint(e.clientX, e.clientY);
    const dropTarget: Element | null | undefined = elementBelow?.closest('app-node');

    if (dropTarget) {
      const inputElement: Element | null = dropTarget.querySelector('input[ng-reflect-model]');

      if (inputElement) {
        const nodeValue: string | null = inputElement.getAttribute('ng-reflect-model');

        if (this.isFavorite && this.draggedNode)
          this.favoriteService.dropNode(this.draggedNode, nodeValue);
      }
    }
  }

  private checkFavoriteHover (e: MouseEvent): void {
    const elementBelow: Element | null = document.elementFromPoint(e.clientX, e.clientY);
    const favoriteElement: Element | null | undefined = elementBelow?.closest('.favorite');

    this.isFavorite = Boolean(favoriteElement);
    this.overFavorite.set(this.isFavorite);
  }


  private getElementPosition (e: MouseEvent, draggedElement: HTMLElement): void {
    const rect: DOMRect = draggedElement.getBoundingClientRect();

    this.elementOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    this.currentElementPosition = {
      x: e.clientX - this.elementOffset.x,
      y: e.clientY - this.elementOffset.y
    };
  }

  private getBoundaries (draggedElement: HTMLElement): void {
    const rect: DOMRect = draggedElement.getBoundingClientRect();
    const rectTree: DOMRect = this.tree.getBoundingClientRect();

    this.boundaries = {
      left: rectTree.left,
      top: rectTree.top,
      right: rectTree.right - rect.width,
      bottom: rectTree.bottom - rect.height
    };
  }
}
