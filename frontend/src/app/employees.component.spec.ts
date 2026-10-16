import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EmployeesComponent } from './employees.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  LucideAngularModule,
  UsersRound,
  UserRoundPlus,
  Check,
  Search,
  Plus,
  Trash2,
  Building2,
} from 'lucide-angular';

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmployeesComponent,
        HttpClientTestingModule,
        LucideAngularModule.pick({
          UsersRound,
          UserRoundPlus,
          Check,
          Search,
          Plus,
          Trash2,
          Building2,
        }),
      ],
    }).compileComponents();
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  function createComponent() {
    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  }

  function setupComponent() {
    createComponent();
    // Handle initial load() call in constructor
    httpMock.expectOne('/api/employees').flush([]);
    fixture.detectChanges();
  }

  it('should create', () => {
    setupComponent();
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    createComponent();
    const mockEmployees = [
      { id: 1, name: 'John', department: 'IT', bio: 'Dev' },
      { id: 2, name: 'Jane', department: 'HR', bio: 'Manager' },
    ];

    httpMock.expectOne('/api/employees').flush(mockEmployees);
    fixture.detectChanges();

    expect(component.rows()).toEqual(mockEmployees);
    expect(component.loading()).toBeFalse();
  });

  it('should handle load error', () => {
    createComponent();
    httpMock.expectOne('/api/employees').flush('Error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(component.errorMessage()).toContain('could not be loaded');
    expect(component.loading()).toBeFalse();
  });

  it('should search employees by name', () => {
    setupComponent();
    const mockResults = [{ id: 3, name: 'Bob', department: 'Sales', bio: 'Sales rep' }];
    component.search({ preventDefault: () => {} } as unknown as Event, 'Bob');
    httpMock.expectOne('/api/employees/search?name=Bob').flush(mockResults);

    expect(component.rows()).toEqual(mockResults);
    expect(component.query()).toBe('Bob');
  });

  it('should render bio as text so injected HTML is not executed', () => {
    setupComponent();
    const maliciousEmployees = [
      { id: 1, name: 'Mallory', department: 'IT', bio: '<script>alert("xss")</script><b>bold</b>' },
    ];
    component.rows.set(maliciousEmployees);
    fixture.detectChanges();

    const bioParagraph: HTMLElement = fixture.nativeElement.querySelector('.employee-bio');
    expect(bioParagraph.textContent).toContain('<b>bold</b>');
    expect(bioParagraph.querySelector('script')).toBeNull();
    expect(bioParagraph.querySelector('b')).toBeNull();
  });

  it('should compute department count', () => {
    setupComponent();
    const mockEmployees = [
      { id: 1, name: 'A', department: 'IT', bio: '' },
      { id: 2, name: 'B', department: 'IT', bio: '' },
      { id: 3, name: 'C', department: 'HR', bio: '' },
    ];
    component.rows.set(mockEmployees);

    expect(component.departmentCount()).toBe(2);
  });

  it('should generate initials from name', () => {
    setupComponent();
    expect(component.initials('John Doe')).toBe('JD');
    expect(component.initials('Alice')).toBe('AL');
    expect(component.initials('  Bob  Smith  ')).toBe('BS');
  });
});