import { Component } from '@angular/core';
import { TreeComponent } from './components/tree/tree.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';

@Component({
  selector: 'app-root',
  imports: [TreeComponent, SearchbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ogs';
}
