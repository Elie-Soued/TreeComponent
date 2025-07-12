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
import { NodeService } from './node.service';
import { NodeComponent } from '../node/node.component';
import { type node } from './node.service';

interface data {
  Interface: string;
  NodeToLoad: string;
  Result: boolean;
  children: node[];
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [MatTreeModule, NodeComponent],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent implements OnInit, OnChanges, AfterViewInit {
  dataSource: node[] = [];
  initialData: node[] = [];
  @ViewChild('tree') tree!: MatTree<node>;
  @Input() searchValue: string | null = '';
  isTreeReady = false;
  childrenAccessor = (node: node) => node.children ?? [];
  hasChild = (_: number, node: node) =>
    !!node.children && node.children.length > 0;

  constructor(private http: HttpClient, private nodeService: NodeService) {}

  ngOnInit(): void {
    this.http.get<data>('menu.json').subscribe((response: data) => {
      this.initialData = response.children;
      this.dataSource = response.children;
    });
  }

  ngAfterViewInit(): void {
    this.isTreeReady = true;
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
