import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { UserService } from '../user/service/user.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';

const mockUserService = {
  getUserByName: jasmine.createSpy('getUserByName').and.callFake((username: string) => {
    console.log('getUserByName called with:', username);
    return of([{ id: '1', name: username, role: 'admin' }]);
  })
};


const mockTranslateService = {
  use: jasmine.createSpy('use'),
  get: jasmine.createSpy('get').and.callFake((key: any) => of(key)),
  onTranslationChange: new Subject(),
  onLangChange: new Subject(),
  onDefaultLangChange: new Subject()
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        MatToolbarModule,
        MatExpansionModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: TranslateService, useValue: mockTranslateService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toBe('TasksApp');
  });

  it('should call translate.use with correct language in changeLang()', () => {
    const mockEvent = {
      target: {
        getAttribute: (attr: string) => attr === 'valueLang' ? 'es' : null
      }
    } as unknown as Event;

    component.changeLang(mockEvent);
    expect(mockTranslateService.use).toHaveBeenCalledWith('es');
  });

  /*
  it('should load user from localStorage in getUserInLocalStorage()', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      console.log('localStorage.getItem called with key:', key);  // Diagnóstico
      return key === 'userLoged' ? 'Test User' : null;
    });

    component.getUserInLocalStorage();

    console.log('userAuxData before detectChanges:', component.userAuxData);

    fixture.detectChanges();

    console.log('userAuxData after detectChanges:', component.userAuxData);

    expect(mockUserService.getUserByName).toHaveBeenCalledWith('Test User');

    expect(component.userAuxData).toEqual({
      id: '1',
      name: 'Test User',
      role: 'admin'
    });
  });
  */


  it('should reset userAuxData if no user in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.getUserInLocalStorage();

    expect(component.userAuxData).toEqual({
      id: '',
      name: '',
      role: ''
    });
  });
});
