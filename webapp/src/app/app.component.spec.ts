import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule
            ],
        }).compileComponents();
    });

    it('should create the app', async () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = await fixture.debugElement.componentInstance;
        console.log('AppComponent: ' + await app);
        expect(app).toBeTruthy();
    });

    it(`should have a title`, async () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = await fixture.debugElement.componentInstance;
        expect(app.title).toEqual('3D Library – Explore And Collect');
    });
});
