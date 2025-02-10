import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SprintService } from './sprint.service';
import { Sprint } from '../models/sprint.model';

describe('SprintService', () => {
  let service: SprintService;
  let httpMock: HttpTestingController;
  let dummySprints: Sprint[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SprintService]
    });
    service = TestBed.inject(SprintService);
    httpMock = TestBed.inject(HttpTestingController);
    dummySprints = [
      { id: '1', name: 'Sprint 1'},
      { id: '2', name: 'Sprint 2'}
    ];
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test para obtener todos los sprints
  it('should retrieve all sprints from the API via GET', () => {
    service.getSprints().subscribe(sprints => {
      expect(sprints.length).toBe(2);
      expect(sprints).toEqual(dummySprints);
    });

    const req = httpMock.expectOne('http://localhost:3000/sprints');
    expect(req.request.method).toBe('GET');
    req.flush(dummySprints);
  });

  // Test para obtener un sprint por su ID
  it('should retrieve a sprint by id from the API via GET', () => {
    const sprintId = '1';
    service.getSprintById(sprintId).subscribe(sprint => {
      expect(sprint).toEqual(dummySprints[0]);
    });

    const req = httpMock.expectOne(`http://localhost:3000/sprints/${sprintId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySprints[0]);
  });

  // Test para crear un sprint
  it('should create a new sprint via POST', () => {
    const newSprint = { id: '3', name: 'Sprint 3'};

    service.createSprint(newSprint).subscribe(sprint => {
      expect(sprint).toEqual(newSprint);
    });

    const req = httpMock.expectOne('http://localhost:3000/sprints');
    expect(req.request.method).toBe('POST');
    req.flush(newSprint);
  });

  // Test para actualizar un sprint
  it('should update an existing sprint via PUT', () => {
    const updatedSprint = { id: '1', name: 'Updated Sprint 1'};

    service.updateSprint2(updatedSprint).subscribe(sprint => {
      expect(sprint).toEqual(updatedSprint);
    });

    const req = httpMock.expectOne(`http://localhost:3000/sprints/${updatedSprint.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedSprint);
  });

  // Test para eliminar un sprint
  it('should delete a sprint via DELETE', () => {
    const sprintId = '1';

    service.deleteSprint(sprintId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:3000/sprints/${sprintId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
