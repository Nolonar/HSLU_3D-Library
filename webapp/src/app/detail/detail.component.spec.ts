import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
    let component: DetailComponent;
    let fixture: ComponentFixture<DetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DetailComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule
            ],
        })
            .compileComponents();
    });

    beforeEach(async () => {
        fixture = await TestBed.createComponent(DetailComponent);
        component = await fixture.componentInstance;
        await fixture.detectChanges();
    });

    it('should create', async () => {
        console.log('DetailComponent: ' + await component);
        expect(component).toBeTruthy();
    });
});
