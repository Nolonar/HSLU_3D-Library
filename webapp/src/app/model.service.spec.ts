import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ModelService } from './model.service';

describe('ModelService', () => {
    beforeEach(async () =>
        await TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                ModelService
            ]
        }));

    it('should be created', async () => {
        const service: ModelService = await TestBed.inject(ModelService);
        expect(service).toBeTruthy();
    });
});
