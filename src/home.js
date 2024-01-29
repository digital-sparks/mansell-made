import Swiper from 'swiper';
import { Keyboard, Parallax } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/all';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

window.Webflow ||= [];
window.Webflow.push(() => {
  // ————— HOMEPAGE CASE SWIPER ————— //
  let workCarouselInit = false,
    workCarousel;
  const workCarouselClasNames = ['work-swiper_wrapper', 'work-swiper_list', 'work-swiper_slide'];

  function initWorkSwiper() {
    if (window.innerWidth > 767) {
      if (!workCarouselInit) {
        // clone slides to fill up loop
        document.querySelectorAll(`.${workCarouselClasNames[2]}`).forEach((slide) => {
          document.querySelector(`.${workCarouselClasNames[1]}`).append(slide.cloneNode(true));
        });

        workCarousel = new Swiper(`.${workCarouselClasNames[0]}`, {
          modules: [Keyboard, Parallax],
          wrapperClass: workCarouselClasNames[1],
          slideClass: workCarouselClasNames[2],
          direction: 'horizontal',
          spaceBetween: 20,
          slidesPerView: 'auto',
          grabCursor: true,
          loop: true,
          centeredSlides: true,
          speed: 600,
          slideToClickedSlide: true,
          parallax: true,
          keyboard: {
            enabled: true,
            onlyInViewport: true,
          },
          on: {
            beforeInit: function () {
              $(this.wrapperEl).css('grid-column-gap', 'unset');
            },
            afterInit: function () {
              workCarouselInit = true;
            },
          },
        });

        workCarousel.slides.forEach((slide) => {
          slide.addEventListener('mouseover', () => {
            gsap.to(slide.querySelectorAll('img')[1], {
              scale: 1.1,
              duration: 0.4,
            });
          });
          slide.addEventListener('mouseout', () => {
            gsap.to(slide.querySelectorAll('img')[1], {
              scale: 1,
              duration: 0.4,
            });
          });
        });
      }
    } else if (workCarouselInit) {
      workCarousel.destroy(true, true);
      workCarouselInit = false;

      // remove duplicate slides
      const totalSlides = document.querySelectorAll(`.${workCarouselClasNames[2]}`).length;
      for (let i = totalSlides - 1; i > totalSlides / 2 - 1; i--) {
        document.querySelectorAll(`.${workCarouselClasNames[2]}`)[i].remove();
      }
    }
  }
  initWorkSwiper();
  window.addEventListener('resize', initWorkSwiper);
  // ————— HOMEPAGE CASE SWIPER ————— //

  // ————— CASE STUDY HOVER ————— //
  gsap.from('.work-swiper_component', {
    opacity: 0,
    scrollTrigger: {
      trigger: '.work-swiper_component',
      start: 'top bottom',
      end: 'bottom top',
      //   markers: true,
    },
  });

  document.querySelectorAll('.work-item_component').forEach((item) => {
    const foregroundImageWrap = item.querySelectorAll('.work-item_small-image-wrap');
    const foregroundImage = item.querySelectorAll('img')[0];
    let backgroundImage = item.querySelectorAll('img');
    backgroundImage = backgroundImage[backgroundImage.length - 1];
    const defaultForegroundScale = 1.05;
    let currentIndex = 0;
    let intervalFunction;

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

  // ————— SPLIT TYPE ————— //
  function splitText(element) {
    const splitOptions = element.getAttribute('split-type');
    return new SplitType(element, { types: splitOptions, tagName: 'span' });
  }

  //   document.querySelectorAll('[split-type]').forEach((element) => {
  //     const splitElement = splitText(element);
  //     console.log(splitElement);

  //     gsap.from(splitElement.lines, {
  //       y: '100%',
  //       opacity: 0,
  //       //   rotationZ: '5',
  //       duration: 0.6,
  //       ease: 'quart.out',
  //       stagger: 0.1,
  //       scrollTrigger: {
  //         markers: false,
  //         trigger: splitElement.elements,
  //         start: 'center bottom',
  //         toggleActions: 'play none resume reverse',
  //       },
  //     });
  //   });
  // ————— SPLIT TYPE ————— //

  // ————— DISCOVER ARTICLES HOVER ————— //

  const articlesLenght = document.querySelectorAll('.discover_list .discover_item').length;
  let articleHover = false;

  document.querySelectorAll('.discover_list .discover_item').forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      gsap.to('.discover_image-list', {
        yPercent: (100 / articlesLenght) * -i,
        duration: articleHover ? 0.8 : 0,
        ease: 'power2.inOut',
        overwrite: true,
      });
      articleHover = true;
    });
  });

  document.querySelector('.discover_list').addEventListener('mouseleave', () => {
    articleHover = false;
  });

  const heroImages = gsap
    .timeline({
      scrollTrigger: {
        markers: true,
        trigger: '.image-parallax_component',
        start: 'top bottom',
        end: 'bottom top',
        // toggleActions: 'play none resume reverse',
        scrub: true,
      },
    })
    .fromTo(
      '.image-parallax_wrap.is-1',
      {
        yPercent: 0,
        ease: 'none',
      },
      {
        yPercent: -15,
        ease: 'none',
      },
      '<'
    )
    .to(
      '.image-parallax_wrap.is-2',
      {
        yPercent: 2,
        ease: 'none',
      },
      '<'
    )
    .to(
      '.image-parallax_wrap.is-3',
      {
        yPercent: 20,
        ease: 'none',
      },
      '<'
    );
});
