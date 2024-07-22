import { Component, Input, input, OnInit } from '@angular/core';

@Component({
  selector: 'share-lazy-image',
  templateUrl: './lazy-image.component.html',
})
export class LazyImageComponent implements OnInit {
  @Input()
  url!: string;

  @Input()
  alt: string = '';

  hasLoaded: boolean = false;

  ngOnInit(): void {
    if (!this.url) throw new Error('Url is required');
  }

  onLoad(): void {
    this.hasLoaded = true;
  }
}
