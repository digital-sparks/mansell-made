import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  // hero image
  gsap.to(document.querySelector('.full-screen-hero_component img'), {
    yPercent: 20,
    filter: 'blur(5px)',
    ease: 'linear',
    scrollTrigger: {
      trigger: document.querySelector('.full-screen-hero_component'),
      start: 'bottom bottom',
      end: 'bottom top',
      scrub: true,
      markers: true,
    },
  });

  const h1 = splitText(document.querySelector('h1'));
  gsap.from(h1.chars, {
    yPercent: 100,
    opacity: 0,
    delay: 0.4,
    rotationZ: 15,
    duration: 0.45,
    ease: 'quart.out',
    stagger: 0.05,
    scrollTrigger: {
      trigger: h1.elements,
      start: 'top bottom',
      end: 'bottom top',
    },
  });

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
          markers: true,
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

  //   document.querySelectorAll('.case-study_number-wrap').forEach((item) => {
  //     const number = splitText(item.querySelector('.heading-size-xsmall'));
  //     console.log(number);
  //     gsap.from(number.chars, {
  //       yPercent: 100,
  //       opacity: 0,
  //       //   rotationZ: '5',
  //       duration: 0.3,
  //       ease: 'quart.out',
  //       stagger: 0.3,
  //       scrollTrigger: {
  //         trigger: number.elements,
  //         start: 'top bottom',
  //         end: 'bottom top',
  //         //   markers: true,
  //       },
  //     });
  //   });

  function splitText(element) {
    const splitOptions = element.getAttribute('split-type');
    return new SplitType(element, { types: splitOptions, tagName: 'span' });
  }
});
