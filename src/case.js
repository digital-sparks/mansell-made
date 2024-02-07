import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

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
    },
  });
  // ————— HERO IMAGE Y PARALLAX ————— //

  // ————— STAR SECTION NUMBER ANIMATION ————— //
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
  // ————— STAR SECTION NUMBER ANIMATION ————— //

  // ————— NEXT PROJECT ANIMATION ————— //
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
  // ————— NEXT PROJECT ANIMATION ————— //

  // ————— CASE STUDY HOVER ————— //
  document.querySelectorAll('.work-item_component').forEach((item) => {
    const foregroundImageWrap = item.querySelectorAll('.work-item_small-image-wrap');
    const foregroundImage = item.querySelectorAll('img')[0];
    let backgroundImage = item.querySelectorAll('img');
    backgroundImage = backgroundImage[backgroundImage.length - 1];
    const defaultBackgroundScale = 1.15;
    const defaultForegroundScale = 1.05;
    let currentIndex = 0;
    let intervalFunction;

    gsap.set(backgroundImage, {
      scale: defaultBackgroundScale,
    });

    gsap.set(foregroundImage, {
      scale: defaultForegroundScale,
    });

    gsap.fromTo(
      backgroundImage,
      {
        yPercent: -7.5,
      },
      {
        yPercent: 7.5,
        ease: 'linear',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    // Initially hide all images
    let images = item.querySelectorAll('.work-item_small-image-wrap img');
    images.forEach((image) => {
      gsap.set(image, { autoAlpha: 0 });
    });

    // Show the first image
    gsap.set(images[currentIndex], { autoAlpha: 1 });

    item.addEventListener('mouseover', () => {
      intervalFunction = setInterval(() => {
        gsap.to(images[currentIndex], { autoAlpha: 0, duration: 0 });
        currentIndex = (currentIndex + 1) % images.length;
        gsap.to(images[currentIndex], { autoAlpha: 1, duration: 0 });
      }, 240);

      gsap
        .timeline()
        .to(foregroundImageWrap, {
          scale: 1.015,
          ease: 'power2.out',
          duration: 0.5,
        })
        .to(
          backgroundImage,
          {
            overwrite: 'auto',
            filter: 'blur(10px)',
            opacity: 0.6,
            ease: 'power1.out',
            duration: 1,
          },
          '<'
        );
    });

    item.addEventListener('mouseout', () => {
      clearInterval(intervalFunction);
      gsap
        .timeline()
        .to(foregroundImageWrap, {
          scale: 1,
          ease: 'power2.out',
          duration: 0.4,
        })
        .to(
          backgroundImage,
          {
            filter: 'blur(0px)',
            opacity: 1,
            duration: 0.6,
          },
          '<'
        );
    });
  });
  // ————— CASE STUDY HOVER ————— //
});
