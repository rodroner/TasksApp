import { Component, signal, OnInit } from '@angular/core';

import { UserService } from '../user/service/user.service';
import { User } from '../user/models/user.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  readonly panelOpenState = signal(false);

  title = 'TasksApp';

  userAuxData: User = {
    id: '',
    name: '',
    role: 'user'
  };

  storedUser: string | null = "";

  constructor(
    private userService: UserService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getUserInLocalStorage();
  }

  changeLang(event: Event) {
    const target = event.target as HTMLElement;
    const lang = target.getAttribute('valueLang');

    if (lang) {
      this.translate.use(lang);
    }
  }

  getUserInLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.storedUser = localStorage.getItem('userLoged');
      if (this.storedUser) {
        this.userService.getUserByName(this.storedUser).subscribe({
          next: (users: User[]) => {
            this.userAuxData = {
              id: users[0].id,
              name: users[0].name,
              role: users[0].role,
            };
          }

        });
      } else {
        this.userAuxData = {
          id: '',
          name: '',
          role: 'user',
        };

      }
    }
  }
}
