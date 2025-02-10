import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../models/category.model';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/categories';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all categories (GET)', () => {
    const mockCategories = [{ id: '1', name: 'Category 1' }, { id: '2', name: 'Category 2' }];

    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories); // Responde con los datos simulados
  });

  it('should fetch a category by ID (GET)', () => {
    const mockCategory = { id: '1', name: 'Category 1' };

    service.getCategoryById('1').subscribe(category => {
      expect(category).toEqual(mockCategory);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
  });

  it('should create a new category (POST)', () => {
    const newCategory = { name: 'New Category' };
    const createdCategory = { id: '3', name: 'New Category' };

    service.createCategory(newCategory).subscribe(category => {
      expect(category).toEqual(createdCategory);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCategory);
    req.flush(createdCategory);
  });

  it('should update a category by ID (PUT)', () => {
    const updatedCategory = { name: 'Updated Category' };

    service.updateCategory('1', updatedCategory).subscribe(category => {
      expect(category).toEqual(updatedCategory);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCategory);
    req.flush(updatedCategory);
  });

  it('should update a category using updateCategory2 (PUT)', () => {
    const updatedCategory: Category = { id: '1', name: 'Updated Category' };

    service.updateCategory2(updatedCategory).subscribe(category => {
      expect(category).toEqual(updatedCategory);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCategory);
    req.flush(updatedCategory);
  });

  it('should delete a category by ID (DELETE)', () => {
    service.deleteCategory('1').subscribe(response => {
      expect(response).toBeNull(); // Suponemos que el backend no retorna datos en la eliminación
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
