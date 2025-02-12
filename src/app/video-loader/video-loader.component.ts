// loading-screen.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-loader',
  imports: [CommonModule],
  templateUrl: './video-loader.component.html',
  styleUrl: './video-loader.component.css'
})
export class VideoLoaderComponent{
  @Input() isLoading: boolean = true;
  @Input() videoSource: string = 'assets/Loading.mp4';
  @Input() loadingText: string = 'Loading...';

  handleVideoError(error: any) {
    console.error('Video loading error:', error);
  }
}