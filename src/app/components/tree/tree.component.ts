import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NodeService } from './node.service';

interface node {
  text: string;
  children?: node[];
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, MatButtonModule],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent implements OnInit, AfterViewInit, OnChanges {
  dataSource: node[] = [];
  initialData: node[] = [];
  @ViewChild('tree') tree!: MatTree<any>;
  @Input() searchValue: string | null = '';
  isTreeReady = false;
  childrenAccessor = (node: node) => node.children ?? [];
  hasChild = (_: number, node: node) =>
    !!node.children && node.children.length > 0;

  constructor(private http: HttpClient, public nodeService: NodeService) {}

  ngOnInit(): void {
    this.http.get('menu.json').subscribe((response: any) => {
      this.initialData = response.children;
      this.dataSource = response.children;
    });
  }

  ngAfterViewInit(): void {
    this.isTreeReady = true;
    // Optionally trigger search after initial view is ready
    this.onSearchChange(this.searchValue);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['searchValue'] &&
      !changes['searchValue'].firstChange &&
      this.isTreeReady
    ) {
      this.onSearchChange(this.searchValue);
    }
  }

  onSearchChange(value: string | null): void {
    this.searchValue = value;

    if (!value || value === '') {
      this.tree.collapseAll();
    } else {
      this.nodeService.expandMatchingNodes(
        this.dataSource,
        value,
        [],
        this.tree
      );
    }
  }
}
