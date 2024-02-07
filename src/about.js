import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  // ————— HERO IMAGE Y PARALLAX ————— //
  gsap.to(document.querySelector('.full-screen-hero_component img'), {
    yPercent: 20,
    filter: 'blur(5px)',
    ease: 'linear',
    scrollTrigger: {
      trigger: document.querySelector('.full-screen-hero_component'),
      start: 'bottom bottom',
      end: 'bottom top',
      scrub: true,
      markers: false,
    },
  });
  // ————— HERO IMAGE Y PARALLAX ————— //
});
