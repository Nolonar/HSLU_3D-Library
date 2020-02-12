import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ModelService } from './model.service';

describe('ModelService', () => {
    beforeEach(async () =>
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                ModelService
            ]
        }));

    it('should be created', async () => {
        const service: ModelService = TestBed.inject(ModelService);
        expect(service).toBeTruthy();
    });
});
