import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.from('.full-screen-hero_component .heading-size-xsmall', {
    yPercent: 50,
    opacity: 0,
    delay: 1.6,
    rotateZ: -1,
    duration: 0.8,
    ease: 'ease.out',
  });

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
});
