
import { Component, Input, Output, EventEmitter, inject, effect } from '@angular/core';
import { NgStyle } from '@angular/common';
import { type Position } from '../../types';
import { MatIconModule } from '@angular/material/icon';
import { DragService } from '../../services/drag.service';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [ NgStyle, MatIconModule ],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss'
})
export class FavoriteButtonComponent {
  @Input() title!: string;

  @Input() position!: Position;

  @Input() isLeftClick: boolean = false;

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  isOverFavorite: boolean = false;

  isDragged: boolean = false;

  private dragService: DragService = inject(DragService);

  constructor () {
    effect(() => {
      this.isOverFavorite = this.dragService.overFavorite();
      this.isDragged = true;
    });
  }

  onClick (): void {
    this.buttonClick.emit();
  }
}
