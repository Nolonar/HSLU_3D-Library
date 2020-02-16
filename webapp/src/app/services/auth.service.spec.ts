import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {

    beforeEach(async () =>
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                AuthService
            ]
        }));

    it('should be created', async () => {
        const service: AuthService = TestBed.inject(AuthService);
        console.log('AuthService: ' + service);
        expect(service).toBeTruthy();
    });
});
