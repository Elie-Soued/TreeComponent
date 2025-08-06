import { Component } from '@angular/core';
import { TreeComponent } from './components/tree/tree.component';
import { SearchInputComponent } from './components/searchinput/searchinput.component';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ TreeComponent, SearchInputComponent, MatIconModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  searchValue: string | null = null;

  showTree: boolean = false;

  isDisabled: boolean = false;


  onSearchValueChange (value: string | null): void {
    this.searchValue = value;
  }

  toggleTree (): void {
    this.showTree = !this.showTree;
  }
}
