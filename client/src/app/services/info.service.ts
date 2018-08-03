import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Message } from '../message';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000';

  getInfo() {
    return this.http.get<Message>(this.url + '/info');
  }

}

