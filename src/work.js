import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  // ————— COUNT NUMBER NEXT TO TITLE ————— //
  function itemsCount() {
    let renderCount = document.querySelector('.work_list').childElementCount;
    let countEl = document.querySelector('.hero-text_item-count');
    countEl.textContent = renderCount < 10 ? '0' + renderCount : renderCount;
  }
  itemsCount();
  // ————— COUNT NUMBER NEXT TO TITLE ————— //

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
