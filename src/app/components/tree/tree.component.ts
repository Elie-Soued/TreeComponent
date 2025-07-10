import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';

interface node {
  text: string;
  children?: node[];
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent implements OnInit {
  dataSource: node[] = [];
  initialData: node[] = [];
  searchValue = '';
  @ViewChild('tree') tree!: MatTree<any>;
  searchControl = new FormControl('');

  childrenAccessor = (node: node) => node.children ?? [];

  hasChild = (_: number, node: node) =>
    !!node.children && node.children.length > 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('menu.json').subscribe((response: any) => {
      this.initialData = response.children;
      this.dataSource = response.children;
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: string | null) => {
        if (value !== null) {
          this.onSearchChange(value);
        }
      });
  }

  onSearchChange(value: string): void {
    this.searchValue = value;

    if (!value || value === '') {
      this.tree.collapseAll();
    } else {
      this.expandMatchingNodes(this.dataSource, value);
    }
  }

  expandMatchingNodes(
    nodes: node[],
    searchTerm: string,
    ancestors: node[] = []
  ) {
    for (const node of nodes) {
      const isMatch = node.text
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (isMatch) {
        // Expand all ancestors of the matching node
        ancestors.forEach((ancestor) => this.tree.expand(ancestor));
      }

      if (node.children?.length) {
        // Recurse with updated ancestors
        this.expandMatchingNodes(node.children, searchTerm, [
          ...ancestors,
          node,
        ]);
      }
    }
  }

  isNodeMatch(node: node): boolean {
    if (!this.searchValue) return false;

    return node.text.toLowerCase().includes(this.searchValue.toLowerCase());
  }
}
