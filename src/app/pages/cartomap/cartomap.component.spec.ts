import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartomapComponent } from './cartomap.component';

describe('CartomapComponent', () => {
  let component: CartomapComponent;
  let fixture: ComponentFixture<CartomapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartomapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartomapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
