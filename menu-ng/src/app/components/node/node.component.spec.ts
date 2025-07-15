import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeComponent } from './node.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NodeService } from '../../services/node.service';
import { MatTree } from '@angular/material/tree';
import { type node } from '../../services/node.service';
import { By } from '@angular/platform-browser';

describe('NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;
  let nodeService: jasmine.SpyObj<NodeService>;
  let mockTree: jasmine.SpyObj<MatTree<node>>;

  const mockNode = {
    text: 'Stammdatenverwaltung',
    iconCls: 'stamm.ico',
    children: [
      {
        text: 'Kundenstamm',
        call: 'R10ST00001',
        iconCls: 'prosoz_16.ico',
        leaf: true,
      },
    ],
  };

  beforeEach(async () => {
    nodeService = jasmine.createSpyObj('NodeService', ['isNodeMatch']);
    mockTree = jasmine.createSpyObj<MatTree<node>>('MatTree', [
      'isExpanded',
      'toggle',
    ]);

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        {
          provide: nodeService,
          useValue: nodeService,
        },
      ],
      imports: [NodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;
    component.isLeaf = false;
    component.node = mockNode;
    component.tree = mockTree;
    component.searchValue = 'pilex';

    fixture.detectChanges();
  });

  it('Render a node', () => {
    const button = fixture.debugElement.query(By.css('#nodeBtn'));
    const icon = fixture.debugElement.query(By.css('#nodeIcon'));
    const span = fixture.debugElement.query(By.css('#nodeSpan'));

    expect(button).toBeTruthy();
    expect(span).toBeTruthy();
    expect(icon).toBeTruthy();
  });

  it('Render a leaf', () => {
    component.node = {
      text: 'Kundenstamm',
      iconCls: 'prosoz_16.ico',
    };

    component.isLeaf = true;

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#leafBtn'));
    const span = fixture.debugElement.query(By.css('#leafSpan'));
    expect(button).toBeTruthy();
    expect(span).toBeTruthy();
  });

  it('Expand node', () => {
    component.node = mockNode;
    component.isLeaf = false;
    const button = fixture.debugElement.query(By.css('#nodeBtn')).nativeElement;
    button.click();
    expect(mockTree.toggle).toHaveBeenCalled();
  });
});
