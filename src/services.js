import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  // services block
  document.querySelectorAll('.services_col').forEach((column) => {
    const servicesText = column.querySelectorAll('.services_item h5');
    const serviceLines = column.querySelectorAll('.line-horizontal');
    console.log(serviceLines);

    gsap
      .timeline({
        scrollTrigger: {
          markers: false,
          trigger: column,
          start: 'top bottom',
          toggleActions: 'play none none reverse',
        },
        defaults: {
          stagger: 0.15,
          delay: 0.2,
          duration: 0.8,
          ease: 'ease.out',
        },
      })
      .fromTo(
        serviceLines,
        {
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 0.4,
          transformOrigin: 'left center',
        }
      )
      .from(
        servicesText,
        {
          opacity: 0,
          yPercent: 20,
          rotateZ: 1,
        },
        '<'
      );
  });
});
