/* eslint-disable @tseslint/prefer-readonly-parameter-types */
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  OnChanges,
  AfterViewChecked,
  inject
} from '@angular/core';
import { NodeService } from '../../services/node.service';
import { type TreeNode } from '../../types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nodelabel',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './nodelabel.component.html',
  styleUrl: './nodelabel.component.scss'
})
export class NodeLabelComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() searchValue: string | null = null;

  @Input() node!: TreeNode;

  @Input() isEnabled?: boolean;

  private shouldFocus: boolean = false;

  before: string = '';

  match: string = '';

  after: string = '';

  @ViewChild('nodeTextInput') input!: ElementRef<HTMLInputElement>;

  public nodeService: NodeService = inject(NodeService);

  private highlightMatchingLetters (node: TreeNode, searchValue: string): void {
    const lowerText: string = node.text.toLowerCase();
    const lowerSearch: string = searchValue.toLowerCase();
    const start: number = lowerText.indexOf(lowerSearch);

    this.before = node.text.slice(0, start);
    this.match = node.text.slice(start, start + searchValue.length);
    this.after = node.text.slice(start + searchValue.length);
  }

  ngOnInit (): void {
    if (this.searchValue)
      this.highlightMatchingLetters(this.node, this.searchValue);
  }

  ngOnChanges (): void {
    if (this.isEnabled)
      this.shouldFocus = true;
  }

  ngAfterViewChecked (): void {
    if (this.shouldFocus) {
      setTimeout(() => {
        const inputEl: HTMLInputElement = this.input.nativeElement;

        inputEl.focus();

        const inputLength: number = inputEl.value.length;

        inputEl.setSelectionRange(inputLength, inputLength);
        this.shouldFocus = false;
      });
    }
  }

  // eslint-disable-next-line @tseslint/class-methods-use-this
  displayHighlightedText (searchValue: string | null): boolean | undefined {
    if (searchValue)
      return searchValue.trim().length > 2;


    return undefined;
  }
}
