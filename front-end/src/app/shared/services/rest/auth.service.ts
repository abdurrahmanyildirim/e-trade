import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {


    loggedIn(): boolean {
        return false;
    }

}
