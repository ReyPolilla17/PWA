import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor(private httpClient:HttpClient) {}

    getPokemoData(): Observable<any> {
        const header = new HttpHeaders().set('Content-Type', 'application/json')

        return this.httpClient.get('https://pokeapi.co/api/v2/pokemon/pikachu')
    }
}