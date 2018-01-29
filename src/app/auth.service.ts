import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';

export class AuthResult {
  constructor (
    public accessToken: string,
    public expiresIn: number
  ) {}
}

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  userProfile = {
    email: undefined,
    password: undefined,
    url: '/access_tokens'
  }

  public login(email: string, password: string) {
    this.http.post(this.userProfile.url, {email: this.userProfile.email, password: this.userProfile.password})
    .map(response => response.accessToken)
    .subscribe(token => this.setSession(new AuthResult(token, 5000)));
    
  };

  // public handleAuthentication(): void {
  //   this.auth.parseHash((err, authResult) => {
  //     if (authResult && authResult.accessToken && authResult.idToken) {
  //       window.location.hash = '';
  //       this.setSession(authResult);
  //       this.router.navigate(['/home']);
  //     } else if (err) {
  //       this.router.navigate(['/home']);
  //       console.log(err);
  //       alert(`Error: ${err.error}. Check the console for further details.`);
  //     }
  //   });
  // }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    // const self = this;
    // this.auth.client.userInfo(accessToken, (err, profile) => {
    //   if (profile) {
    //     self.userProfile = profile;
    //   }
    //   cb(err, profile);
    // });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    // this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
