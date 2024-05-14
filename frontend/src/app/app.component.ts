import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './login.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FormsModule, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    public username = '';
    public password = '';

    public isLoggedIn = false;

    public loading = false;

    constructor(
        private _loginSvc: LoginService,
        private _http: HttpClient,
    ) {}

    public ngOnInit(): void {
        this._loginSvc.onLoggedInChanged.subscribe((isLoggedIn) => this.isLoggedIn = isLoggedIn);
        this._loginSvc.isLoggedIn();
    }

    public submit() {
        this._loginSvc.login(this.username, this.password);
    }

    private postApi(endpoint: string) {
        this.loading = true;
        this._http.post(endpoint, null, {
            observe: 'response',
            headers: this._loginSvc.getAuthHeader()
        }).subscribe({
            next: (response) => {
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        })
    }

    public powerOn() {
        this.postApi('/api/control/on');
    }

    public powerOff() {
        this.postApi('/api/control/off');
    }

    public restart() {
        this.postApi('/api/control/restart');
    }
}
