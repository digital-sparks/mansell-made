import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { _horizontal } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import CustomEase from 'gsap/CustomEase';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(Observer);

CustomEase.create('button', '1, 0, .25, 1');

window.Webflow ||= [];
window.Webflow.push(() => {
  // ————— LENIS ————— //
  ('use strict'); // fix lenis in safari

  if (Webflow.env('editor') === undefined) {
    let lenis = new Lenis();

    $('[data-lenis-start]').on('click', function () {
      lenis.start();
    });

    $('[data-lenis-stop]').on('click', function () {
      lenis.stop();
    });

    $('[data-lenis-toggle]').on('click', function () {
      $(this).toggleClass('stop-scroll');
      if ($(this).hasClass('stop-scroll')) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    lenis.on('scroll', ScrollTrigger.refresh);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }
  // ————— LENIS ————— //

  // ————— GET LONDON TIME ————— //
  function getLondonTime() {
    let londonTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/London' });
    londonTime = new Date(londonTime);

    let hours = londonTime.getHours();
    const amPm = hours >= 12 ? 'pm' : 'am';
    hours = hours.toString().padStart(2, '0');

    let minutes = londonTime.getMinutes().toString().padStart(2, '0');
    const seperator = londonTime.getSeconds() % 2 ? ':' : ' ';

    const timeElement = document.querySelector('[data-name=current-time');
    if (timeElement) {
      timeElement.textContent = `${hours}${seperator}${minutes} ${amPm}`;
    }
  }

  setInterval(getLondonTime, 1000);
  getLondonTime();
  // ————— GET LONDON TIME ————— //

  // ————— GET CURRENT YEAR ————— //
  document.querySelectorAll('[data-name=current-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
  // ————— GET CURRENT YEAR ————— //

  // ————— SPLIT TEXT ————— //

  function splitText(element) {
    const splitOptions = element.getAttribute('split-type');
    return new SplitType(element, { types: splitOptions, tagName: 'span' });
  }

  document.querySelectorAll('.quote_component').forEach((element) => {
    const backgroundOverlay = element.querySelector('.overlay-full'),
      blockquote = splitText(element.querySelector('blockquote')),
      author = element.querySelector('[data-name=author]'),
      role = element.querySelector('[data-name=role]'),
      company = element.querySelector('[data-name=company]');

    gsap
      .timeline({
        scrollTrigger: {
          markers: false,
          trigger: element,
          start: 'center bottom',
          toggleActions: 'play none resume reverse',
        },
      })
      .from(backgroundOverlay, {
        bottom: '100%',
        duration: 1.4,
        ease: 'quart.out',
      })
      .from(
        blockquote.lines,
        {
          delay: 0.2,
          y: '75%',
          opacity: 0,
          rotationZ: '1',
          duration: 1.2,
          ease: 'back.out',
          stagger: 0.1,
        },
        '<+0.2'
      )
      .from(
        [author, role, company],
        {
          opacity: 0,
          yPercent: 10,
          stagger: 0.05,
          duration: 1.2,
        },
        '<+0.5'
      );
  });

  document.querySelectorAll('.what-we-do_component').forEach((element) => {
    const backgroundOverlay = element.querySelector('.overlay-full'),
      heading = splitText(element.querySelector('.heading-size-large')),
      services = element.querySelectorAll('.heading-size-small'),
      button = element.querySelector('.button');
    gsap
      .timeline({
        scrollTrigger: {
          markers: false,
          trigger: element,
          start: 'center bottom',
          toggleActions: 'play none resume reverse',
        },
      })
      .from(backgroundOverlay, {
        bottom: '100%',
        duration: 3,
        ease: 'quart.out',
      })
      .from(
        heading.chars,
        {
          delay: 0.2,
          yPercent: 5,
          opacity: 0,
          rotationZ: '1',
          duration: 1.4,
          ease: 'back.out',
          stagger: 0.075,
        },
        '<+0.2'
      )
      .from(
        [services, button],
        {
          opacity: 0,
          yPercent: 10,
          rotateZ: 1,
          transformOrigin: 'left center',
          stagger: 0.075,
          duration: 1.2,
        },
        '<+0.5'
      );
  });

  // ————— DIVIDER COMPONENT ————— //

  document.querySelectorAll('.divider_component').forEach((element) => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        end: 'bottom 10%',
        toggleActions: 'play none resume reverse',
        // scrub: true,
        markers: false,
      },
    });

    timeline
      .from(element.querySelectorAll('.line-horizontal'), {
        duration: 1.6,
        scaleX: 0,
        ease: 'quart.out',
      })
      .from(
        element.querySelectorAll('.icon-star'),
        {
          duration: 0.6,
          opacity: 0,
          scale: 1.5,
        },
        '>-0.2'
      );
  });

  // ————— DIVIDER COMPONENT ————— //

  // ————— NAV MENU ————— //

  let menuAnimation = gsap.timeline({});
  let menuLinks = document.querySelectorAll('.nav_open-link');
  //   let menuDetails = document.querySelectorAll('[data-menu-stagger]');
  let menuWrap = document.querySelector('.nav_open');
  //   let menuBg = document.querySelector('.menu-bg');
  let isOpen = false;

  let menuOpen = () => {
    isOpen = true;
    menuAnimation.clear();
    menuAnimation.progress(0);
    menuAnimation
      .set(menuWrap, { display: 'flex' })
      //   .fromTo(menuBg, { scaleY: 0 }, { scaleY: 1, ease: 'expo.out', duration: 1 })
      .fromTo(
        menuLinks,
        {
          opacity: 0,
          yPercent: 50,
        },
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.6,
          ease: 'expo.out',

          stagger: { each: 0.1, from: 'start' },
        },
        0.6
      );
    //   .fromTo(
    //     menuDetails,
    //     {
    //       opacity: 0,
    //       yPercent: 50,
    //     },
    //     {
    //       opacity: 1,
    //       yPercent: 0,
    //       duration: 0.6,
    //       ease: 'expo.out',
    //       stagger: { each: 0.05, from: 'start' },
    //     },
    //     '<'
    //   );
  };

  let menuClose = () => {
    menuAnimation.clear();
    menuAnimation.progress(0);
    menuAnimation
      .to(menuLinks, {
        opacity: 0,
        yPercent: 50,
        duration: 0.4,
        ease: 'power4.out',
        stagger: { each: 0.05, from: 'end' },
      })
      //   .to(
      //     menuDetails,
      //     {
      //       opacity: 0,
      //       yPercent: 50,
      //       duration: 0.4,
      //       ease: 'power4.out',
      //       stagger: { each: 0.05, from: 'start' },
      //     },
      //     0
      //   )
      //   .to(menuBg, { scaleY: 0, ease: 'expo.out', duration: 0.8 }, '<+=0.4')
      .set(menuWrap, { display: 'none' });
  };

  document.querySelector('.nav_menu-button').addEventListener('click', () => {
    if (isOpen) {
      menuClose();
    } else {
      menuOpen();
    }
  });

  // ————— NAV MENU ————— //

  CustomEase.create('linkUnderline', '1, 0, .25, 1');
  const linkUnderlineDuration = 0.6;

  //   document.querySelectorAll('.link_component.is-line-initial-visible').forEach((link) => {
  //     const underline = link.querySelector('.line-horizontal');
  //     let tween;

  //     const textPre = new SplitType(link.querySelector('.text-size-regular'), {
  //       types: 'chars',
  //       tagName: 'span',
  //     });
  //     const textPost = new SplitType(link.querySelectorAll('.text-size-regular')[1], {
  //       types: 'chars',
  //       tagName: 'span',
  //     });
  //     const animation = gsap
  //       .timeline()
  //       .to(textPre.chars, {
  //         yPercent: -100,
  //         stagger: 0.02,
  //         duration: 1,
  //         ease: 'button',
  //       })
  //       .to(
  //         textPost.chars,
  //         {
  //           yPercent: -100,
  //           stagger: 0.02,
  //           duration: 1,
  //           ease: 'button',
  //         },
  //         '<'
  //       )
  //       .pause();

  //     link.addEventListener('mouseenter', () => {
  //       tween = gsap.fromTo(
  //         underline,
  //         {
  //           xPercent: 0,
  //         },
  //         {
  //           xPercent: 100,
  //           duration: linkUnderlineDuration,
  //           ease: 'linkUnderline',
  //           overwrite: false,
  //         }
  //       );
  //       animation.play();
  //     });
  //     link.addEventListener('mouseleave', () => {
  //       const reverseInterval = setInterval(function () {
  //         if (!tween.isActive()) {
  //           clearInterval(reverseInterval);
  //           gsap.fromTo(
  //             underline,
  //             {
  //               xPercent: -100,
  //             },
  //             {
  //               xPercent: 0,
  //               duration: linkUnderlineDuration,
  //               ease: 'linkUnderline',
  //               overwrite: false,
  //             }
  //           );
  //           animation.reverse();
  //         }
  //       }, 10);
  //     });
  //   });

  document.querySelectorAll('.link_component').forEach((link) => {
    const hideLineByDefault = link.classList.contains('is-line-initial-left');

    const underline = link.querySelector('.line-horizontal');
    let tween;

    const textPre = new SplitType(link.querySelector('.text-size-regular'), {
      types: 'chars',
      tagName: 'span',
    });
    const textPost = new SplitType(link.querySelectorAll('.text-size-regular')[1], {
      types: 'chars',
      tagName: 'span',
    });
    const animation = gsap
      .timeline()
      .to(textPre.chars, {
        yPercent: -100,
        stagger: 0.02,
        duration: 1,
        ease: 'button',
      })
      .to(
        textPost.chars,
        {
          yPercent: -100,
          stagger: 0.02,
          duration: 1,
          ease: 'button',
        },
        '<'
      )
      .pause();

    link.addEventListener('mouseenter', () => {
      tween = gsap.fromTo(
        underline,
        {
          x: hideLineByDefault ? '-100%' : '0%',
        },
        {
          x: hideLineByDefault ? '0%' : '100%',
          duration: linkUnderlineDuration,
          ease: 'linkUnderline',
        }
      );
      animation.play();
    });
    link.addEventListener('mouseleave', () => {
      const reverseInterval = setInterval(function () {
        if (!tween.isActive()) {
          clearInterval(reverseInterval);
          if (hideLineByDefault) {
            gsap.to(underline, {
              x: '100%',
              duration: linkUnderlineDuration,
              ease: 'linkUnderline',
            });
          } else {
            gsap.fromTo(
              underline,
              {
                x: '-100%',
              },
              {
                x: '0%',
                duration: linkUnderlineDuration,
                ease: 'linkUnderline',
                overwrite: false,
              }
            );
          }
        }
        animation.reverse();
      }, 10);
    });
  });
  // ————— NAV MENU ————— //

  // ————— GlOBAL IMAGE PARALLAX EFFECT ————— //

  document.querySelectorAll('img[data-effect=parallax]').forEach((image) => {
    gsap.set(image, { scale: 1.15 });

    gsap.from(image, {
      opacity: 0.2,
      duration: 1,
      scrollTrigger: {
        trigger: image.parentNode,
        start: '10% bottom',
        end: 'bottom top',
        markers: true,
        toggleActions: 'play none resume reverse',
      },
    });

    gsap.fromTo(
      image,
      {
        yPercent: -7.5,
      },
      {
        yPercent: 7.5,
        ease: 'linear',
        scrollTrigger: {
          trigger: image.parentNode,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          toggleActions: 'play none resume reverse',
          //   markers: false,
        },
      }
    );
  });
  // ————— GlOBAL IMAGE PARALLAX EFFECT ————— //

  document.querySelectorAll('.button').forEach((button) => {
    const textPre = new SplitType(button.querySelector('.button_text_pre'), {
      types: 'chars',
      tagName: 'span',
    });
    const textPost = new SplitType(button.querySelector('.button_text_post'), {
      types: 'chars',
      tagName: 'span',
    });
    const animation = gsap
      .timeline()
      .to(textPre.chars, {
        yPercent: -100,
        stagger: 0.02,
        duration: 1,
        ease: 'button',
      })
      .to(
        textPost.chars,
        {
          yPercent: -100,
          stagger: 0.02,
          duration: 1,
          ease: 'button',
        },
        '<'
      )
      .pause();

    button.addEventListener('mouseenter', () => {
      animation.seek(0);
      animation.play();
    });
    button.addEventListener('mouseleave', () => {
      //   animation.reverse();
    });
  });

  document.querySelectorAll('.star-heading_component').forEach((item) => {
    const text = new SplitType(item.querySelector('h2'), {
      types: 'chars, words',
      tagName: 'span',
    });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: item,
          start: 'bottom 90%',
          end: 'bottom top',
          markers: true,
          toggleActions: 'play none resume reverse',
        },
      })
      //   .from(text.words, {
      //     xPercent: -125,
      //     transformOrigin: 'left center',
      //     opacity: 0,
      //     ease: 'power2.out',
      //     duration: 1.4,
      //   })
      .from(text.chars, {
        x: '-1rem',
        opacity: 0,
        stagger: 0.01,
        ease: 'power2.out',
        duration: 0.8,
        delay: 0.4,
      })
      .from(
        item.querySelector('.icon-star'),
        {
          opacity: 0,
        },
        '>-0.25'
      );
  });

  let object = {
    value: 1,
  };

  let tl = gsap.timeline({
    repeat: -1,
    onReverseComplete: () => {
      tl.progress(1);
    },
  });
  tl.fromTo(
    '.star-heading_component .icon-star',
    {
      rotateZ: 0,
    },
    {
      rotateZ: 360,
      duration: 3,
      ease: 'none',
    }
  );

  Observer.create({
    target: window,
    type: 'wheel,scroll,touch',
    onChangeY: (self) => {
      let v = self.velocityY * 0.006;
      v = gsap.utils.clamp(-60, 60, v);
      tl.timeScale(v);
      let resting = 1;
      if (v < 0) {
        resting = -1;
      }
      gsap.fromTo(
        object,
        { value: v },
        {
          value: resting,
          duration: 1,
          onUpdate: () => {
            tl.timeScale(object.value);
          },
        }
      );
    },
  });

  //   animateStars.to('.star-heading_component .icon-star', {
  //     rotateZ: 360,
  //     repeat: -1,
  //     ease: 'linear',
  //     duration: 200,
  //     scrollTrigger: {
  //       trigger: '.page-wrapper',
  //       start: 'top 90%',
  //       end: 'bottom 10%',
  //       scrub: true,
  //       markers: false,
  //     },
  //   });

  document.querySelector('.pre-footer_component .center-card_component').style.display = 'none';

  const footerText = new SplitType(
    document.querySelectorAll('.pre-footer_component .heading-size-xxlarge'),
    {
      types: 'chars',
      tagName: 'span',
    }
  );

  const footerTimeline = gsap
    .timeline({
      scrollTrigger: {
        markers: false,
        trigger: '.pre-footer_component',
        start: 'center bottom',
        toggleActions: 'play none resume reverse',
      },
    })
    // .from(footerText.chars, {
    //   yPercent: 80,
    //   rotateZ: 10,
    //   opacity: 0,
    //   stagger: 0.05,
    //   ease: 'power1.inOut',
    // })
    // .from(footerText.chars, {
    //   duration: 1.2,
    //   rotateZ: 1,
    //   rotateX: 40,
    //   rotateY: 20,
    //   yPercent: 12,
    //   transformOrigin: 'left bottom',
    //   opacity: 0,
    //   delay: 0.5,
    //   //   ease: 'power1.out',
    //   stagger: 0.04,
    //   ease: CustomEase.create(
    //     'custom',
    //     'M0,0 C0.126,0.382 0.373,0.954 0.569,1.035 0.792,1.126 0.818,1.001 1,1 '
    //   ),
    // })
    .fromTo(
      '.pre-footer_component .center-card_component',
      {
        display: 'none',
        opacity: 0,
      },
      {
        display: 'block',
        opacity: 1,
        ease: 'power1.inOut',
      },
      '<+0.4'
    );

  //   gsap.to('.pre-footer_component heading-size-xxlarge');

  document.querySelectorAll('.logos_component').forEach((item) => {
    item.querySelector('.logos_wrapper').append(item.querySelector('.logos_list').cloneNode(true));
    item.querySelector('.logos_wrapper').append(item.querySelector('.logos_list').cloneNode(true));

    let tl = gsap.timeline({ repeat: -1, onReverseComplete: () => tl.progress(1) });
    tl.to(item.querySelectorAll('.logos_list'), { xPercent: -100, duration: 60, ease: 'none' });

    let object = { value: 1 };

    Observer.create({
      target: window,
      type: 'wheel,touch',
      wheelSpeed: -1,
      onChangeY: (self) => {
        let v = self.velocityY * -0.01;
        v = gsap.utils.clamp(-60, 60, v);
        tl.timeScale(v);
        let resting = 1;
        if (v < 0) resting = -1;
        gsap.fromTo(
          object,
          { value: v },
          { value: resting, duration: 1, onUpdate: () => tl.timeScale(object.value) }
        );
      },
    });
  });
  document.querySelectorAll('.form_input').forEach((input) => {
    input.addEventListener('focus', () => {
      input.nextSibling.style.opacity = 1;
    });
    input.addEventListener('blur', () => {
      input.nextSibling.style.opacity = 0.4;
    });
  });

  document.querySelectorAll('.dropdown_component, .discover_item').forEach((dropdown) => {
    const line = dropdown.querySelector('.line-horizontal'),
      icon = dropdown.querySelector('.icon-star svg'),
      heading = new SplitType(dropdown.querySelector('.text-size-regular'), {
        types: 'words, chars',
        tagName: 'span',
      });

    const animation = gsap
      .timeline({
        scrollTrigger: {
          markers: true,
          trigger: dropdown,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play none resume reverse',
          //   scrub: true,
        },
      })
      .fromTo(
        line,
        {
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 0.4,
          duration: 1,
          delay: 0.25,
          ease: 'ease.out',
          transformOrigin: 'left',
        }
      )
      .fromTo(
        heading.words,
        {
          opacity: 0,
          yPercent: 50,
          duration: 0,
          rotateZ: 1,
        },
        {
          opacity: 1,
          rotateZ: 0,
          stagger: 0.02,
          yPercent: 0,
          duration: 0.8,
        },
        '<+0.2'
      );

    dropdown.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        duration: 0.25,
        scale: 1.25,
      });
    });
    dropdown.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        duration: 0.25,
        scale: 1,
      });
    });
  });

  document.querySelectorAll('[split-type=title]').forEach((title) => {
    const headingText = new SplitType(title, {
      types: 'lines, chars',
      tagName: 'span',
    });

    gsap.from(headingText.chars, {
      scrollTrigger: {
        trigger: headingText.elements,
        start: 'top bottom',
        end: 'bottom top',
        markers: false,
        toggleActions: 'play none resume reverse',
      },
      duration: 1.2,
      rotateZ: 1,
      rotateX: 40,
      rotateY: 20,
      yPercent: 12,
      transformOrigin: 'left bottom',
      opacity: 0,
      delay: 0.5,
      stagger: 0.04,
      ease: CustomEase.create(
        'custom',
        'M0,0 C0.126,0.382 0.373,0.954 0.569,1.035 0.792,1.126 0.818,1.001 1,1 '
      ),
    });
  });

  document.querySelectorAll('.line-vertical').forEach((line) => {
    gsap.from(line, {
      scaleY: 0,
      opacity: 0,
      duration: 1,
      delay: 0.25,
      ease: 'ease.out',
      transformOrigin: 'center top',
      scrollTrigger: {
        markers: false,
        trigger: line,
        start: 'bottom 95%',
        toggleActions: 'play none resume reverse',
      },
    });
  });

  document.querySelectorAll('[split-type=subtitle]').forEach((element) => {
    const h1SplitText = new SplitType(element, { types: 'lines', tagName: 'span' });

    gsap.from(h1SplitText.lines, {
      yPercent: 50,
      opacity: 0,
      rotationZ: 1,
      duration: 1.2,
      ease: 'quart.out',
      stagger: 0.15,
      scrollTrigger: {
        markers: false,
        trigger: h1SplitText.elements,
        start: 'bottom bottom',
        toggleActions: 'play none resume reverse',
      },
    });
  });

  document.querySelectorAll('.preloader_component').forEach((preloader) => {
    gsap.set(preloader, { display: 'flex' });

    gsap
      .timeline()
      .to(preloader.querySelectorAll('.preloader_panel'), {
        delay: 0,
        scaleY: 0,
        transformOrigin: function (index, target, targets) {
          console.log(index, target, targets);
          console.log(index % 2);
          return index % 2 ? 'center bottom' : 'center top';
        },
        stagger: {
          grid: [5, 2],
          each: 0.05,
          //   from: 'center',
        },
        duration: 2,
      })
      .to(preloader, {
        opacity: 0,
        display: 'none',
      });
  });
});
