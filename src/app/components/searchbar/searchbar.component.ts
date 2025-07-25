import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent implements OnInit, OnDestroy {
  @Output() searchValue: EventEmitter<string | null> = new EventEmitter<string | null>();

  searchControl: FormControl = new FormControl('');

  private valueChangeSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.valueChangeSubscription = this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: string | null) => {
        this.searchValue.emit(value);
      });
  }

  clearForm(): void {
    this.searchControl.setValue('');
  }

  ngOnDestroy(): void {
    this.valueChangeSubscription?.unsubscribe();
  }
}
