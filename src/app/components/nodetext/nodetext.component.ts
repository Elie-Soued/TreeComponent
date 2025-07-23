import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NodeService } from '../../services/node.service';
import { type node } from '../../types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nodetext',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nodetext.component.html',
  styleUrl: './nodetext.component.scss',
})
export class NodetextComponent implements OnInit {
  @Input() searchValue: string | null = null;
  @Input() node!: node;
  @Input() isEnabled?: boolean;
  private shouldFocus = false;
  before: string = '';
  match: string = '';
  after: string = '';

  @ViewChild('nodeTextInput') input!: ElementRef<HTMLInputElement>;

  constructor(public nodeService: NodeService) {}

  ngOnInit(): void {
    if (this.searchValue) {
      this.highlightMatchingLetters(this.node, this.searchValue);
    }
  }

  ngOnChanges() {
    if (this.isEnabled) {
      this.shouldFocus = true;
    }
  }

  ngAfterViewChecked() {
    if (this.shouldFocus && this.input) {
      setTimeout(() => {
        const inputEl = this.input.nativeElement;
        inputEl.focus();

        const length = inputEl.value.length;
        inputEl.setSelectionRange(length, length);

        this.shouldFocus = false;
      });
    }
  }

  private highlightMatchingLetters(node: node, searchValue: string): void {
    const lowerText = node.text.toLowerCase();
    const lowerSearch = searchValue.toLowerCase();
    const start = lowerText.indexOf(lowerSearch);
    this.before = node.text.slice(0, start);
    this.match = node.text.slice(start, start + searchValue.length);
    this.after = node.text.slice(start + searchValue.length);
  }

  displayHighlightedText(searchValue: string | null): boolean | undefined {
    if (searchValue) {
      return searchValue.trim().length > 2;
    }
    return undefined;
  }
}
