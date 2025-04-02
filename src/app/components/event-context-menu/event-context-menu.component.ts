// event-context-menu.component.ts
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-context-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-context-menu.component.html',
  styleUrls: ['./event-context-menu.component.css']
})
export class EventContextMenuComponent {
  @Input() eventId: string = '';
  @Input() position = { top: '0px', left: '0px' };
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();


  showDeleteConfirmation = false;

  onEdit(event: MouseEvent) {
    this.edit.emit();
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.showDeleteConfirmation = true;
  }

  confirmDelete() {
    this.showDeleteConfirmation = false;
    this.delete.emit();
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
  }
}