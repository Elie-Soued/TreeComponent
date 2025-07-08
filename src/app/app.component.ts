import { Component } from '@angular/core';
import { TreeComponent } from './components/tree/tree.component';

@Component({
  selector: 'app-root',
  imports: [TreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ogs';
}
