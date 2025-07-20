import { Component, Input } from '@angular/core';
import { NodeService } from '../../services/node.service';
import { type node } from '../../types';

@Component({
  selector: 'app-nodetext',
  standalone: true,
  imports: [],
  templateUrl: './nodetext.component.html',
  styleUrl: './nodetext.component.scss',
})
export class NodetextComponent {
  @Input() searchValue: string | null = null;
  @Input() node!: node;
  before: string = '';
  match: string = '';
  after: string = '';

  constructor(public nodeService: NodeService) {}

  ngOnInit() {
    if (this.searchValue) {
      this.highlightMatchingLetters(this.node, this.searchValue);
    }
  }

  highlightMatchingLetters(node: node, searchValue: string): void {
    const lowerText = node.text.toLowerCase();
    const lowerSearch = searchValue.toLowerCase();
    const start = lowerText.indexOf(lowerSearch);
    this.before = node.text.slice(0, start);
    this.match = node.text.slice(start, start + searchValue.length);
    this.after = node.text.slice(start + searchValue.length);
  }

  displayHighlightedText(searchValue: string | null) {
    if (searchValue) {
      return searchValue.trim() && searchValue.length > 2;
    }
    return undefined;
  }
}
