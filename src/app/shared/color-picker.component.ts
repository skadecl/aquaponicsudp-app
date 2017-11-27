import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  template: `
    <ng-content></ng-content>
    <button
      class="btn btn-{{buttonStyle}} border border-dark"
      type="button"
      [ngbPopover]="popContent"
      [placement]="placement"
      container="body"
      #p="ngbPopover"
      (document:click)="p.close()"
      (click)="$event.stopPropagation()"
    >
      <span class="small">
        <div class="d-inline" *ngIf="selectedColor == ''">
          <span class="d-none d-md-inline-block">Selecciona</span>
          <span class="d-inline-block d-md-none">Elige</span>
        </div>
        <div class="d-inline" *ngIf="selectedColor != ''">
          <span class="bade badge-{{selectedColor}} badge-pill">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </span>
      &nbsp;&nbsp;<i class="fa fa-caret-down"></i>
    </button>

    <ng-template #popContent>
      <div class="selector">
        <span
          *ngFor="let color of colors"
          class="bade badge-{{color}} badge-pill color-option d-block"
          (click)="innerOnSelect(color)"
          >
          <span class="offset-9"></span></span>
      </div>
    </ng-template>
  `,
  styles: ['.color-option {margin-bottom: 5px;}', '.color-option:hover {border: 1px solid black;}', '.selector {overflow-y: auto; max-height: 155px; width: 80px;}']
})
export class ColorPickerComponent implements OnInit {
  colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
  @Input() buttonStyle = 'light';
  @Output() onSelect: EventEmitter<string> = new EventEmitter();
  @Input() placement = 'bottom';
  @Input() updateOnSelect = true;
  @Input() selectedColor = '';

  constructor() {}

  ngOnInit() {}

  innerOnSelect(color: string) {
    if (this.updateOnSelect) {
      this.selectedColor = color;
    }
    this.onSelect.emit(color);
  }

}
