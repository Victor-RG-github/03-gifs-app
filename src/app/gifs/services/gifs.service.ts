import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  gifList: Gif[] = [];

  private giphyApiKey: string = 'HMBl2PEOpNkkZ8ZXyhruRdSA49xk8Rsd';
  private giphyApiUrl: string = 'https://api.giphy.com/v1/gifs';
  private _tagHistory: string[] = [];

  constructor(private httpClient: HttpClient) {
    this.loadLocalStorage();
    if (this._tagHistory?.length > 0) {
      this.searchTag(this._tagHistory[0]);
    }
  }

  get tagHistory(): string[] {
    return [...this._tagHistory];
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    let params = new HttpParams()
      .set('api_key', this.giphyApiKey)
      .set('limit', '10')
      .set('offset', '0')
      .set('rating', 'g')
      .set('bundle', 'messaging_non_clips')
      .set('q', tag);

    this.httpClient
      .get<SearchResponse>(`${this.giphyApiUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
      });
  }

  private organizeHistory(tag: string): void {
    const validatedTag = tag.toLowerCase();
    if (this._tagHistory.includes(validatedTag)) {
      this._tagHistory.splice(this._tagHistory.indexOf(validatedTag), 1);
    }
    if (this._tagHistory.length === 10) {
      this._tagHistory.splice(this._tagHistory.length - 1, 1);
    }
    this._tagHistory.unshift(tag);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagHistory));
  }

  private loadLocalStorage(): void {
    const history = localStorage.getItem('history');
    if (history) {
      this._tagHistory = JSON.parse(history);
    }
  }
}
