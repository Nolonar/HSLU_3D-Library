import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
    let component: NotFoundComponent;
    let fixture: ComponentFixture<NotFoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                NotFoundComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule
            ],
        })
            .compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(NotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', async () => {
        console.log('NotFoundComponent: ' + component);
        expect(component).toBeTruthy();
    });
});
