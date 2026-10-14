import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  Building2,
  Check,
  LucideAngularModule,
} from 'lucide-angular';

interface Employee {
  id?: number;
  name: string;
  department: string;
  bio: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <header class="topbar">
      <a class="brand" href="/" aria-label="Employee Directory home">
        <span class="brand-mark"><lucide-angular name="users-round" [size]="21"></lucide-angular></span>
        <span class="brand-copy">
          <strong>people<span>.</span></strong>
          <small>TEAM DIRECTORY</small>
        </span>
      </a>

      <nav class="top-nav" aria-label="Main navigation">
        <a class="nav-item nav-item-active" href="/" aria-current="page">
          <lucide-angular name="users-round" [size]="17"></lucide-angular>
          Directory
          <span class="nav-count">{{ rows().length }}</span>
        </a>
      </nav>

      <div class="topbar-status">
        <span class="status-indicator"></span>
        <span>Directory live</span>
      </div>
    </header>

    <main class="page-shell">
      <section class="page-heading">
        <div class="heading-copy">
          <p class="eyebrow">PEOPLE OPERATIONS <span>/</span> DIRECTORY</p>
          <h1>Good work starts <em>together.</em></h1>
          <p class="heading-note">The people, skills, and stories behind the work.</p>
        </div>

        <div class="stats" aria-label="Directory summary">
          <div class="stat-item">
            <span class="stat-value">{{ rows().length }}</span>
            <span class="stat-label">PEOPLE</span>
          </div>
          <span class="stat-divider" aria-hidden="true"></span>
          <div class="stat-item">
            <span class="stat-value">{{ departmentCount() }}</span>
            <span class="stat-label">TEAMS</span>
          </div>
        </div>
      </section>

      @if (notice()) {
        <p class="notice" role="status"><lucide-angular name="check" [size]="16"></lucide-angular>{{ notice() }}</p>
      }
      @if (errorMessage()) {
        <p class="error-message" role="alert">{{ errorMessage() }}</p>
      }

      <div class="workspace">
        <aside class="add-panel" aria-labelledby="add-heading">
          <div class="panel-heading">
            <span class="panel-icon"><lucide-angular name="user-round-plus" [size]="19"></lucide-angular></span>
            <div>
              <h2 id="add-heading">Add a teammate</h2>
              <p>Make room for someone new.</p>
            </div>
          </div>

          <form #employeeForm class="employee-form" (submit)="add($event, employeeForm, nameInput.value, departmentInput.value, bioInput.value)">
            <label for="employee-name">Full name</label>
            <input
              #nameInput
              id="employee-name"
              name="name"
              type="text"
              placeholder="e.g. Alex Morgan"
              autocomplete="name"
              maxlength="120"
              required
            >

            <label for="employee-department">Team</label>
            <input
              #departmentInput
              id="employee-department"
              name="department"
              type="text"
              placeholder="e.g. Product"
              maxlength="120"
              required
            >

            <div class="label-row">
              <label for="employee-bio">A little about them</label>
              <span>OPTIONAL</span>
            </div>
            <textarea
              #bioInput
              id="employee-bio"
              name="bio"
              rows="4"
              maxlength="500"
              placeholder="What do they work on? What should teammates know?"
            ></textarea>
            <div class="field-hint">Plain text, up to 500 characters.</div>

            <button class="button button-primary add-button" type="submit" [disabled]="saving()">
              @if (saving()) {
                <span class="button-spinner" aria-hidden="true"></span>
                Adding teammate...
              } @else {
                <lucide-angular name="plus" [size]="17"></lucide-angular>
                Add to directory
              }
            </button>
          </form>

          <div class="panel-footnote">
            <span class="footnote-mark" aria-hidden="true"></span>
            Employee details are visible to your team.
          </div>
        </aside>

        <section class="directory-panel" aria-labelledby="directory-heading">
          <div class="directory-heading">
            <div>
              <p class="eyebrow">YOUR PEOPLE</p>
              <h2 id="directory-heading">The directory</h2>
            </div>
            <span class="record-count">{{ rows().length }} {{ rows().length === 1 ? 'person' : 'people' }}</span>
          </div>

          <div class="directory-toolbar">
            <form class="search-form" role="search" (submit)="search($event, searchInput.value)">
              <lucide-angular name="search" [size]="18"></lucide-angular>
              <input
                #searchInput
                type="search"
                aria-label="Search employees by name"
                placeholder="Find someone by name..."
                [value]="query()"
              >
              <button class="search-button" type="submit" aria-label="Search directory" title="Search">
                <lucide-angular name="search" [size]="17"></lucide-angular>
              </button>
            </form>
            <button class="button button-subtle show-all-button" type="button" (click)="load()" [disabled]="loading()">
              Show everyone
            </button>
          </div>

          @if (loading()) {
            <div class="state-panel" role="status">
              <span class="state-spinner" aria-hidden="true"></span>
              <span>Finding your people...</span>
            </div>
          } @else if (rows().length === 0) {
            <div class="state-panel empty-state">
              <span class="empty-icon"><lucide-angular name="users-round" [size]="25"></lucide-angular></span>
              <h3>{{ query() ? 'No one by that name yet' : 'Your directory is taking shape' }}</h3>
              <p>{{ query() ? 'Try another name or show everyone.' : 'Add the first teammate to get your directory started.' }}</p>
              @if (query()) {
                <button class="button button-subtle" type="button" (click)="load()">Show everyone</button>
              }
            </div>
          } @else {
            <div class="employee-grid">
              @for (employee of rows(); track employee.id) {
                <article class="employee-card">
                  <div class="employee-card-top">
                    <span
                      class="employee-avatar"
                      [class.avatar-tone-1]="avatarTone(employee.name) === 1"
                      [class.avatar-tone-2]="avatarTone(employee.name) === 2"
                      [class.avatar-tone-3]="avatarTone(employee.name) === 3"
                    >{{ initials(employee.name) }}</span>
                    <button
                      class="icon-button delete-button"
                      type="button"
                      [attr.aria-label]="'Delete ' + employee.name"
                      [title]="'Delete ' + employee.name"
                      (click)="deleteEmployee(employee)"
                    >
                      <lucide-angular name="trash-2" [size]="16"></lucide-angular>
                    </button>
                  </div>
                  <h3>{{ employee.name }}</h3>
                  <p class="employee-team"><lucide-angular name="building-2" [size]="14"></lucide-angular>{{ employee.department }}</p>
                  <p class="employee-bio" [innerHTML]="getBioHtml(employee.bio || 'No biography added yet.')"></p>
                  <div class="employee-card-footer">
                    <span class="footer-dot"></span>
                    Team member
                  </div>
                </article>
              }
            </div>
          }
        </section>
      </div>

      <footer class="page-footer">
        <span>PEOPLE MAKE THE PLACE</span>
        <span>EMPLOYEE DIRECTORY <span class="footer-year">/ 2026</span></span>
      </footer>
    </main>
  `,
})
export class EmployeesComponent {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private api = '/api/employees';

  rows = signal<Employee[]>([]);
  loading = signal(true);
  saving = signal(false);
  query = signal('');
  errorMessage = signal('');
  notice = signal('');
  departmentCount = computed(() => new Set(this.rows().map(employee => employee.department.trim()).filter(Boolean)).size);

  constructor() {
    this.load();
  }

  /**
   * INTENTIONALLY VULNERABLE: XSS via bypassSecurityTrustHtml
   * 
   * This is a classic Angular anti-pattern. Using bypassSecurityTrustHtml tells
   * Angular "trust me, this HTML is safe" - but we're passing raw user input!
   * 
   * An employee could enter: <script>alert('XSS')</script> or
   * <img src=x onerror=stealCookies()>
   * 
   * SonarQube rule: typescript:S5131 (Angular bypassSecurityTrust* methods should not be used)
   * 
   * Fix options:
   * 1. Use {{ employee.bio }} interpolation (Angular auto-escapes)
   * 2. Use [innerHTML]="sanitizer.sanitize(SecurityContext.HTML, bio)" 
   * 3. Use a safe pipe that only allows whitelisted tags
   */
  getBioHtml(bio: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(bio);
  }

  load() {
    this.query.set('');
    this.errorMessage.set('');
    this.loading.set(true);
    this.http.get<Employee[]>(this.api).subscribe({
      next: employees => {
        this.rows.set(employees);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('The directory could not be loaded. Check your connection and try again.');
        this.loading.set(false);
      },
    });
  }

  search(event: Event, name: string) {
    event.preventDefault();
    const searchName = name.trim();
    if (!searchName) {
      this.load();
      return;
    }

    this.query.set(searchName);
    this.errorMessage.set('');
    this.loading.set(true);
    this.http.get<Employee[]>(this.api + '/search', { params: { name: searchName } }).subscribe({
      next: employees => {
        this.rows.set(employees);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Search is unavailable right now. Please try again.');
        this.loading.set(false);
      },
    });
  }

  add(event: Event, form: HTMLFormElement, name: string, department: string, bio: string) {
    event.preventDefault();
    const employee = { name: name.trim(), department: department.trim(), bio: bio.trim() };
    if (!employee.name || !employee.department) return;

    this.errorMessage.set('');
    this.notice.set('');
    this.saving.set(true);
    this.http.post<Employee>(this.api, employee).subscribe({
      next: () => {
        this.saving.set(false);
        this.notice.set(`${employee.name} was added to the directory.`);
        form.reset();
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('That teammate could not be added. Please try again.');
      },
    });
  }

  deleteEmployee(employee: Employee) {
    if (employee.id === undefined) return;

    this.errorMessage.set('');
    this.notice.set('');
    this.http.delete<void>(this.api + '/' + employee.id).subscribe({
      next: () => {
        this.notice.set(`${employee.name} was removed from the directory.`);
        this.load();
      },
      error: () => this.errorMessage.set('That teammate could not be removed. Please try again.'),
    });
  }

  initials(name: string) {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return words[0]?.slice(0, 2).toUpperCase() || '?';
  }

  avatarTone(name: string) {
    return (name.charCodeAt(0) || 0) % 4;
  }
}
