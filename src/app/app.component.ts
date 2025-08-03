import { Component } from '@angular/core';
import { TreeComponent } from './components/tree/tree.component';
import { SearchinputComponent } from './components/searchinput/searchinput.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TreeComponent, SearchinputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  searchValue: string | null = null;

  onSearchValueChange(value: string | null): void {
    this.searchValue = value;
  }
}
