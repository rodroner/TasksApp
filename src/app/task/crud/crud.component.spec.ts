import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CrudComponent } from './crud.component';
import { TaskService } from '../service/task.service';
import { of } from 'rxjs';
import { Task } from '../models/task.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearcherComponent } from './searcher/searcher.component';
import { ListComponent } from './list/list.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateStore } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

/*
describe('CrudComponent', () => {
  let component: CrudComponent;
  let fixture: ComponentFixture<CrudComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['use', 'setDefaultLang', 'get', 'onTranslationChange']);

  const mockTasks: Task[] = [
    { id: '1', name: 'Task 1'} as Task,
    { id: '2', name: 'Task 2'} as Task
  ];

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('TaskService', ['getTasks']);

    spy.getTasks.and.returnValue(of(mockTasks));

    translateServiceSpy.get.and.returnValue(of(''));
    translateServiceSpy.onTranslationChange.and.returnValue(of({}))

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        CommonModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        NoopAnimationsModule,
        SearcherComponent,
        ListComponent,
      ],
      providers: [
        { provide: TaskService, useValue: spy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: TranslateStore, useValue: {} } // Mock TranslateStore
      ]
    }).compileComponents();

    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.tasksList.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should set loading to true before loading tasks', () => {
    component.loading = false;
    component.ngOnInit();
    expect(component.loading).toBeTrue();
  });

  it('should filter tasks when getListFilter is called', () => {
    component.getListFilter([mockTasks[0]]);
    expect(component.tasksListShow.length).toBe(1);
    expect(component.tasksListShow[0].name).toBe('Task 1');
  });

  it('should update tasksListShow when onFilteredTasks is called', () => {
    component.onFilteredTasks([mockTasks[1]]);
    expect(component.tasksListShow.length).toBe(1);
    expect(component.tasksListShow[0].name).toBe('Task 2');
  });
});
*/
