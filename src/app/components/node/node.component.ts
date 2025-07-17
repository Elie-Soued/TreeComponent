import { Component, Input } from '@angular/core';
import { NodeService } from '../../services/node.service';
import { MatIconModule } from '@angular/material/icon';
import { type node } from '../../services/node.service';
import { MatTree } from '@angular/material/tree';
import { NodetextComponent } from '../nodetext/nodetext.component';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [MatIconModule, NodetextComponent],
  templateUrl: './node.component.html',
  styleUrl: './node.component.css',
})
export class NodeComponent {
  @Input() isLeaf: boolean = false;
  @Input() node!: node;
  @Input() searchValue: string | null = null;
  @Input() tree!: MatTree<node>;

  constructor(public nodeService: NodeService) {}

  toggleNode(node: node): void {
    this.tree.toggle(node);
  }
}
