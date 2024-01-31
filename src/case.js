import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  // hero image parallax
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

  // star + section number animation
  document.querySelectorAll('.case-study_number-wrap').forEach((item) => {
    const text = new SplitType(item.querySelector('.heading-size-xsmall'), {
      types: 'chars, words',
      tagName: 'span',
    });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          markers: false,
          toggleActions: 'play none resume reverse',
        },
      })
      .from(text.chars, {
        x: '-1rem',
        opacity: 0,
        stagger: 0.02,
        ease: 'power2.out',
        duration: 0.8,
        delay: 0.2,
      })
      .from(
        item.querySelector('.icon-star'),
        {
          opacity: 0,
        },
        '>-0.25'
      );
  });

  // next project animation
  gsap.from('.next-project_component .heading-size-small', {
    yPercent: 25,
    duration: 0.6,
    opacity: 0,
    ease: 'power1.out',
    delay: 1.1,
    scrollTrigger: {
      markers: false,
      trigger: '.next-project_component',
      start: '5% bottom',
      end: 'bottom top',
    },
  });
});
