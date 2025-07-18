import { Component, Input, HostListener } from '@angular/core';
import { NodeService } from '../../services/node.service';
import { MatIconModule } from '@angular/material/icon';
import { type node } from '../../services/node.service';
import { MatTree } from '@angular/material/tree';
import { NodetextComponent } from '../nodetext/nodetext.component';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [MatIconModule, NodetextComponent, NgStyle],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss',
})
export class NodeComponent {
  @Input() isLeaf: boolean = false;
  @Input() node!: node;
  @Input() searchValue: string | null = null;
  @Input() tree!: MatTree<node>;

  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedNode: node | null = null;

  constructor(public nodeService: NodeService) {
    this.nodeService.contextMenuState$.subscribe((state) => {
      this.contextMenuVisible = state.visible && state.node === this.node;
      this.contextMenuPosition = state.position;
    });
  }

  toggleNode(node: node): void {
    this.tree.toggle(node);
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.nodeService.showContextMenu(this.node, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  @HostListener('document:click')
  hideContextMenu() {
    this.nodeService.hideContextMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.nodeService.hideContextMenu();
  }
}
