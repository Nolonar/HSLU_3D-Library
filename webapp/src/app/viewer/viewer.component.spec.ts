import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewerComponent } from './viewer.component';

describe('ViewerComponent', () => {
    let component: ViewerComponent;
    let fixture: ComponentFixture<ViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                ViewerComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule
            ],
        })
            .compileComponents();
    });

    beforeEach(async () => {
        fixture = await TestBed.createComponent(ViewerComponent);
        component = await fixture.componentInstance;
        await fixture.detectChanges();
    });

    it('should create', async () => {
        console.log('ViewerComponent: ' + await component);
        expect(component).toBeTruthy();
    });
});
