import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
    let component: OverviewComponent;
    let fixture: ComponentFixture<OverviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                OverviewComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule
            ],
        })
            .compileComponents();
    });

    beforeEach(async () => {
        fixture = await TestBed.createComponent(OverviewComponent);
        component = await fixture.componentInstance;
        await fixture.detectChanges();
    });

    it('should create', async () => {
        console.log('OverviewComponent: ' + await component);
        expect(component).toBeTruthy();
    });
});
