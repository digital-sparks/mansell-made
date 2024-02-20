import Swiper from 'swiper';
import { Keyboard, Parallax, Mousewheel } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  // ————— HERO IMAGES PARALLAX ————— //
  let matchMedia = gsap.matchMedia();
  matchMedia.add('(min-width: 768px)', () => {
    const heroImagesParallax = gsap
      .timeline({
        scrollTrigger: {
          trigger: '.image-parallax_component',
          start: 'top bottom',
          end: 'bottom top',
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
  // ————— HERO IMAGES PARALLAX ————— //

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
          modules: [Keyboard, Parallax, Mousewheel],
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
          mousewheel: {
            enabled: true,
            forceToAxis: true,
            releaseOnEdges: true,
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
    // Slide transition when enter view
    ScrollTrigger.create({
      trigger: ".work-swiper_wrapper",
      start: "top center",
      once:true,
      onEnter:()=>{
        workCarousel.slideNext(600, true);
      }
    })

  }
  initWorkSwiper();
  window.addEventListener('resize', initWorkSwiper);
  // ————— HOMEPAGE CASE SWIPER ————— //

  // ————— CASE STUDY SCROLL INTO VIEW ————— //
  gsap.from('.work-swiper_component .work-item_component img', {
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.work-swiper_component',
      start: 'top 95%',
      end: 'bottom top',
      markers: false,
    },
  });
  // ————— CASE STUDY SCROLL INTO VIEW ————— //

  // ————— CASE STUDY HOVER ————— //
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

    // PARALLAX BACKGROUND IMAGE ON Y SCROLL
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

    // HOVER EFFECT
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

  // ————— DISCOVER ARTICLES HOVER ————— //
  const articlesLenght = document.querySelectorAll('.discover_list .discover_item').length;
  let articleHover = false;

  document.querySelectorAll('.discover_list .discover_item').forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      gsap.to('.discover_image-list', {
        yPercent: (100 / articlesLenght) * -i,
        duration: articleHover ? 0.8 : 0,
        ease: 'power3.inOut',
        overwrite: true,
      });
      articleHover = true;
    });
  });

  document.querySelector('.discover_list').addEventListener('mouseleave', () => {
    articleHover = false;
  });
  // ————— DISCOVER ARTICLES HOVER ————— //
});
