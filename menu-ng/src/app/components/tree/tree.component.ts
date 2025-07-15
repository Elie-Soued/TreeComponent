import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
} from '@angular/core';

import { MatTree, MatTreeModule } from '@angular/material/tree';
import { NodeService } from '../../services/node.service';
import { NodeComponent } from '../node/node.component';
import { type node, type data } from '../../services/node.service';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [MatTreeModule, NodeComponent],
  templateUrl: './tree.component.html',
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

  constructor(private nodeService: NodeService) {}

  ngOnInit(): void {
    this.nodeService.getInitialData().subscribe((response: data) => {
      this.initialData = response.children;
      this.dataSource = response.children;
    });
  }

  ngAfterViewInit(): void {
    this.isTreeReady = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const searchValueChanged =
      changes['searchValue'] &&
      !changes['searchValue'].firstChange &&
      this.isTreeReady;

    const searchValueIsEmpty = !this.searchValue || this.searchValue === '';

    if (searchValueChanged) {
      if (searchValueIsEmpty) {
        this.tree.collapseAll();
      } else {
        this.nodeService.expandMatchingNodes(
          this.dataSource,
          this.searchValue!,
          [],
          this.tree
        );
      }
    }
  }
}
