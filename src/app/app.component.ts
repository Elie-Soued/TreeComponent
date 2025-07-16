import { Component } from '@angular/core';
import { TreeComponent } from './components/tree/tree.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';

@Component({
  selector: 'app-root',
   standalone : true,
  imports: [TreeComponent, SearchbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  searchValue: string | null = null;

  onSearchValueChange(value: string | null) {
    this.searchValue = value;
  }
}
