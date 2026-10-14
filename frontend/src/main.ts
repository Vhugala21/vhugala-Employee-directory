import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { EmployeesComponent } from './app/employees.component';
import { Building2, Check, LucideAngularModule, Plus, Search, Trash2, UserRoundPlus, UsersRound } from 'lucide-angular';

bootstrapApplication(EmployeesComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({ Building2, Check, Plus, Search, Trash2, UserRoundPlus, UsersRound })),
  ],
})
  .catch(err => console.error(err));
