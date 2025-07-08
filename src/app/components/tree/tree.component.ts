import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
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

  childrenAccessor = (node: node) => node.children ?? [];

  hasChild = (_: number, node: node) =>
    !!node.children && node.children.length > 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('menu.json').subscribe((response: any) => {
      this.initialData = response.children;
      this.dataSource = response.children;
    });
  }

  onSearchChange(value: string): void {
    if (value || value.trim() !== '') {
      this.dataSource = this.filterTree(this.initialData, value);
    } else {
      this.dataSource = this.initialData;
    }
  }

  filterTree(nodes: node[], searchTerm: string): node[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return nodes;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return nodes
      .map((node) => {
        const filteredChildren = node.children
          ? this.filterTree(node.children, searchTerm)
          : [];

        const isMatch = node.text.toLowerCase().includes(lowerSearchTerm);

        if (isMatch || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : [],
          };
        }

        return null;
      })
      .filter((node) => node !== null) as node[];
  }
}
