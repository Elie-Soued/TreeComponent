import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface node {
  name: string;
  children?: node[];
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, MatButtonModule],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'], // fix: styleUrls (plural)
})
export class TreeComponent {
  dataSource = [];

  childrenAccessor = (node: node) => node.children ?? [];

  hasChild = (_: number, node: node) =>
    !!node.children && node.children.length > 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('menu.json').subscribe((response: any) => {
      this.dataSource = response.children;
    });
  }
}
