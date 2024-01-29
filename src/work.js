import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  function itemsCount() {
    let renderCount = document.querySelector('.work_list').childElementCount;
    let countEl = document.querySelector('.hero-text_item-count');
    if (renderCount < 10) {
      renderCount = '0' + renderCount;
    }
    countEl.textContent = renderCount;
  }

  itemsCount();

  // ————— CASE STUDY HOVER ————— //

  document.querySelectorAll('.work-item_component').forEach((item) => {
    console.log(item);

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
          //   markers: true,
        },
      }
    );

    item.addEventListener('mouseover', () => {
      intervalFunction = setInterval(() => {
        gsap.to(images[currentIndex], { autoAlpha: 0, duration: 0 });
        currentIndex = (currentIndex + 1) % images.length;
        gsap.to(images[currentIndex], { autoAlpha: 1, duration: 0 });
      }, 250);

      gsap
        .timeline()
        .to(foregroundImageWrap, {
          scale: 1.02,
          ease: 'power2.out',
        })
        .to(
          backgroundImage,
          {
            overwrite: 'auto',
            filter: 'blur(10px)',
            opacity: 0.6,
            duration: 1,
          },
          '<'
        );
      // .to(
      //   foregroundImage,
      //   {
      //     scale: 1.03,
      //     ease: 'power2.out',
      //   },
      //   '<'
      // );
    });

    item.addEventListener('mouseout', () => {
      clearInterval(intervalFunction);
      gsap
        .timeline()
        .to(foregroundImageWrap, {
          scale: 1,
        })
        .to(
          backgroundImage,
          {
            // overwrite: 'auto',
            filter: 'blur(0px)',
            opacity: 1,
            duration: 1,
          },
          '<'
        );
    });

    let images = item.querySelectorAll('.work-item_small-image-wrap img');

    // Initially hide all images
    images.forEach((image) => {
      gsap.set(image, { autoAlpha: 0 });
    });

    // Show the first image
    gsap.set(images[currentIndex], { autoAlpha: 1 });
  });
  // ————— CASE STUDY HOVER ————— //
});
