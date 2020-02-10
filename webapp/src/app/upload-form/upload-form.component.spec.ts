import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UploadFormComponent } from './upload-form.component';


describe('UploadFormComponent', () => {
  let component: UploadFormComponent;
  let fixture: ComponentFixture<UploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UploadFormComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
    })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(UploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    console.log('UploadFormComponent: ' + component);
    expect(component).toBeTruthy();
  });
});
