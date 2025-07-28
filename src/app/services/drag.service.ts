/* eslint-disable no-console */
/* eslint-disable @tseslint/class-methods-use-this */
/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Injectable } from '@angular/core';
import { type position, type node } from '../types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DragService {
  isDragging: boolean = false;

  dragStartPosition: position = { x: 0, y: 0 };

  currentMousePosition: position = { x: 0, y: 0 };

  draggedNode: node | null = null;

  elementOffset: position = { x: 0, y: 0 };

  private shareDraggedPosition: BehaviorSubject<position> = new BehaviorSubject<position>({
    x: 0,
    y: 0,
  });

  shareDraggedPosition$: Observable<position> = this.shareDraggedPosition.asObservable();

  startDrag(e: MouseEvent, node: node, element: HTMLElement): void {
    this.isDragging = true;
    this.draggedNode = node;

    const rect: DOMRect = element.getBoundingClientRect();

    this.elementOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    this.dragStartPosition = { x: rect.left, y: rect.top };
    this.currentMousePosition = {
      x: e.clientX - this.elementOffset.x,
      y: e.clientY - this.elementOffset.y,
    };
    this.shareDraggedPosition.next(this.currentMousePosition);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.body.style.userSelect = 'none';
  }

  onMouseMove = (e: MouseEvent): void => {
    if (!this.isDragging) return;

    this.currentMousePosition = {
      x: e.clientX - this.elementOffset.x,
      y: e.clientY - this.elementOffset.y,
    };
    this.shareDraggedPosition.next(this.currentMousePosition);
  };

  onMouseUp = (e: MouseEvent): void => {
    if (!this.isDragging) return;

    this.handleDrop(e);
    this.isDragging = false;
    this.draggedNode = null;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.body.style.userSelect = '';
  };

  handleDrop(e: MouseEvent): void {
    const elementBelow: Element | null = document.elementFromPoint(e.clientX, e.clientY);
    const dropTarget: Element | null | undefined =
      elementBelow?.closest('.drop-target') &&
      elementBelow.closest('app-node') &&
      elementBelow.closest('.node-container');

    if (dropTarget) {
      console.log('Valid drop target:', dropTarget);
    }
  }
}
