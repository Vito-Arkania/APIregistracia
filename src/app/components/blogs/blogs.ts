import { Component, ElementRef, inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-blogs',
  imports: [],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css',
})
export class Blogs {
   private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private observer!: IntersectionObserver;

  ngAfterViewInit(): void {
    this.initObserver();
  }

  private initObserver(): void{
    const options = { threshold: 0.20 };

    this.observer = new IntersectionObserver((entries, obs) =>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'animate-show');
          obs.unobserve(entry.target);
        }
      });
    },options);
    const elements = this.el.nativeElement.querySelectorAll('.animate-on-scroll');
    elements.forEach((el: HTMLElement) =>{
      this.renderer.addClass(el, 'animate-hidden');
      this.observer.observe(el);
    })
  }
}
