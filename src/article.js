import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

window.Webflow ||= [];
window.Webflow.push(() => {
  document.querySelectorAll('.blog_item-wrap').forEach((article) => {
    const animation = gsap
      .timeline()
      .fromTo(
        article.querySelector('.blog_image-wrap'),
        { scale: 1 },
        {
          scale: 0.95,
          ease: 'power3.inOut',
          duration: 0.8,
        }
      )
      .fromTo(
        article.querySelector('img'),
        { scale: 1.15 },
        {
          scale: 1.175,
          duration: 0.8,
          ease: 'power3.inOut',
        },
        '<'
      )
      .pause();

    article.addEventListener('mouseenter', () => {
      animation.timeScale(1).play();
    });

    article.addEventListener('mouseleave', () => {
      animation.timeScale(1.25).reverse();
    });
  });
});
