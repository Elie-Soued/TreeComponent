/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, inject } from '@angular/core';
import { NgStyle } from '@angular/common';
import { type Position } from '../../types';
import { MatIconModule } from '@angular/material/icon';
import { DragService } from '../../services/drag.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [NgStyle, MatIconModule],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss',
})
export class FavoriteButtonComponent implements OnInit, OnDestroy {
  @Input() title!: string;

  @Input() position!: Position;

  @Input() isLeftClick: boolean = false;

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  private subscriptions: Subscription = new Subscription();

  isOverFavorite: boolean = false;

  isDragged: boolean = false;

  private dragService: DragService = inject(DragService);

  ngOnInit(): void {
    this.subscriptions.add(
      this.dragService.isOverFavorite$.subscribe((state: boolean) => {
        this.isOverFavorite = state;
        this.isDragged = true;
      }),
    );
  }

  onClick(): void {
    this.buttonClick.emit();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
