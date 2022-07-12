import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAlteracaoComponent } from './dialog-alteracao.component';

describe('DialogAlteracaoComponent', () => {
  let component: DialogAlteracaoComponent;
  let fixture: ComponentFixture<DialogAlteracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAlteracaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAlteracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
