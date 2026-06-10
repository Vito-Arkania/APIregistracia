import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

interface ObserverOptions {
  threshold: number;
}

@Component({
  selector: 'app-footer',
  standalone: true, // Добавляем, так как используется imports
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer implements AfterViewInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.initObserver();
  }

  private initObserver(): void {
    const options: ObserverOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Используем Renderer2 для безопасной манипуляции DOM
          this.renderer.addClass(entry.target, 'animate-show');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Ищем элементы только внутри текущего компонента (this.el.nativeElement)
    const items = this.el.nativeElement.querySelectorAll('.footer-item');
    
    items.forEach((item: HTMLElement) => {
      this.renderer.addClass(item, 'animate-hidden');
      observer.observe(item);
    });
  }
}