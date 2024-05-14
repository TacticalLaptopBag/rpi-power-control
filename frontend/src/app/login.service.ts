import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private _loggedIn = new BehaviorSubject(false);
    public onLoggedInChanged = this._loggedIn.asObservable();
    private __isLoggedIn = false;
    private get _isLoggedIn(): boolean {
        return this.__isLoggedIn;
    }
    private set _isLoggedIn(value: boolean) {
        if (value === this.__isLoggedIn) return;
        this.__isLoggedIn = value;
        this._loggedIn.next(value);

        if (!value)
            this._token = '';
    }

    private _token = '';

    constructor(
        private _http: HttpClient,
    ) { }

    public getAuthHeader(): { [header: string]: string | string[] } {
        return {
            jwt_auth_token: this._token
        }
    }

    public async isLoggedIn(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this._http.get('/api/login', {
                observe: 'response',
                headers: this.getAuthHeader()
            }).subscribe({
                next: (response) => {
                    if (response.ok) {
                        console.log('Still logged in');
                        this._isLoggedIn = true;
                        resolve(true);
                    } else {
                        console.error('No longer logged in');
                        this._isLoggedIn = false;
                        resolve(false);
                    }
                },
                error: () => {
                    console.error('No longer logged in');
                    this._isLoggedIn = false;
                    resolve(false);
                }
            });
        });
    }

    public login(username: string, password: string) {
        this._http.post('/api/login', null, {
            observe: 'response',
            headers: {
                auth_username: username,
                auth_password: password,
            }
        }).subscribe({
            next: (response) => {
                const token = response.headers.get('jwt_auth_token');
                if (response.ok && token !== null) {
                    console.log('Successfully logged in');
                    this._isLoggedIn = true;
                    this._token = token;
                } else {
                    console.error('Failed to log in');
                    this._isLoggedIn = false;
                }
            },
            error: () => {
                console.error('Failed to log in');
                this._isLoggedIn = false;
            }
        });
    }
}
