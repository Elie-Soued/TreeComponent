import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-searchinput',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './searchinput.component.html',
  styleUrl: './searchinput.component.scss',
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Output() searchValue: EventEmitter<string | null> = new EventEmitter<string | null>();

  searchControl: FormControl = new FormControl('');

  private searchDebounceDelay: number = 300;

  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchControl.valueChanges
        .pipe(debounceTime(this.searchDebounceDelay), distinctUntilChanged())
        .subscribe((value: string | null) => {
          this.searchValue.emit(value);
        }),
    );
  }

  clearForm(): void {
    this.searchControl.setValue('');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
