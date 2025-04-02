import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventContextMenuComponent } from './event-context-menu.component';

describe('EventContextMenuComponent', () => {
  let component: EventContextMenuComponent;
  let fixture: ComponentFixture<EventContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventContextMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
