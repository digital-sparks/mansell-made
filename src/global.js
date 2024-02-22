import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import CustomEase from 'gsap/CustomEase';
import SplitType from 'split-type';
import ClipboardJS from 'clipboard';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(Observer);
let matchMedia = gsap.matchMedia();
let preloaderDelay = 0.8; // set the delay offset for all animations based on how long it takes for the preloader to finish.

window.Webflow ||= [];
window.Webflow.push(() => {
  // ————— LENIS ————— //
  ('use strict'); // fix lenis in safari
  let lenis;
  if (Webflow.env('editor') === undefined) {
    lenis = new Lenis();

    $('[data-lenis-start]').on('click', function () {
      lenis.start();
    });

    $('[data-lenis-stop]').on('click', function () {
      lenis.stop();
    });

    lenis.on('scroll', ScrollTrigger.refresh);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // recalculate page height when FAQ dropdown is opened
    document.querySelectorAll('.dropdown_component').forEach((dropdown) => {
      dropdown.addEventListener('click', () => {
        setTimeout(() => {
          lenis.resize();
        }, 750); // timeout value equals faq interaction duration (see Webflow interaction)
      });
    });
  }
  // ————— LENIS ————— //

  // ————— GET LONDON TIME ————— //
  function getLondonTime() {
    let londonTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/London' });
    londonTime = new Date(londonTime);

    let hours = londonTime.getHours();
    hours = hours.toString().padStart(2, '0');

    const amPm = hours >= 12 ? 'pm' : 'am',
      minutes = londonTime.getMinutes().toString().padStart(2, '0'),
      seperator = londonTime.getSeconds() % 2 ? ':' : ' ',
      timeElement = document.querySelector('[data-name=current-time');

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

  // ————— SPLIT TEXT FUNCTION ————— //
  function splitText(element) {
    const splitOptions = element.getAttribute('split-type');
    return new SplitType(element, { types: splitOptions, tagName: 'span' });
  }
  // ————— SPLIT TEXT FUNCTION ————— //

  // ————— BUTTON HOVER ANIMATION ————— //
  CustomEase.create('buttonEase', '.5, 0, .25, 1'); // custom ease for the text and underline animation
  const buttonTextDuration = 0.5; // duration of the text effect on button and link hovers. When changing this, also modify the button line values in the custom css file

  document.querySelectorAll('.button').forEach((button) => {
    // Typesplit the visible text
    const textPre = new SplitType(button.querySelector('.button_text_pre'), {
      types: 'chars',
      tagName: 'span',
    });
    // Typesplit the invisible text that will animate up
    const textPost = new SplitType(button.querySelector('.button_text_post'), {
      types: 'chars',
      tagName: 'span',
    });

    const buttonHoverAnimation = gsap
      .timeline()
      .to(textPre.chars, {
        yPercent: -100,
        stagger: 0.0175,
        duration: buttonTextDuration,
        ease: 'buttonEase',
      })
      .to(
        textPost.chars,
        {
          yPercent: -100,
          stagger: 0.0175,
          duration: buttonTextDuration,
          ease: 'buttonEase',
        },
        '<'
      )
      .pause();

    button.addEventListener('mouseenter', () => {
      if (!buttonHoverAnimation.isActive()) buttonHoverAnimation.seek(0);
      buttonHoverAnimation.play();
      // the stars and black underline animation are controlled with css
    });
  });

  // ————— BUTTON HOVER ANIMATION ————— //

  // ————— LINK BUTTON HOVER ANIMATION ————— //
  document.querySelectorAll('.link_component').forEach((link) => {
    const hideLineByDefault = link.classList.contains('is-line-initial-left'); // determine the starting position of the underline
    const isMenuButton = link.classList.contains('is-menu'); // check is button is the menu button
    const underline = link.querySelector('.line-horizontal');

    // Typesplit the visible text
    const textPre = new SplitType(link.querySelector('.text-size-regular'), {
      types: 'chars',
      tagName: 'span',
    });
    // Typesplit the invisible text that will animate up
    const textPost = new SplitType(link.querySelectorAll('.text-size-regular')[1], {
      types: 'chars',
      tagName: 'span',
    });
    // timeline for animating the characters in the link text
    const letterAnimation = gsap
      .timeline()
      .to(textPre.chars, {
        yPercent: -100,
        stagger: 0.0175,
        duration: buttonTextDuration,
        ease: 'buttonEase',
      })
      .to(
        textPost.chars,
        {
          yPercent: -100,
          stagger: 0.0175,
          duration: buttonTextDuration,
          ease: 'buttonEase',
        },
        '<'
      )
      .pause();

    let lineAnimation = gsap.set(underline, {});

    // on hoverIn...
    link.addEventListener('mouseenter', () => {
      if (!letterAnimation.isActive()) letterAnimation.seek(0);
      if (!isMenuButton) letterAnimation.play();
      const reverseInterval = setInterval(function () {
        if (!lineAnimation.isActive()) {
          clearInterval(reverseInterval);
          lineAnimation = gsap.fromTo(
            underline,
            {
              x: hideLineByDefault ? '-100%' : '0%',
            },
            {
              x: hideLineByDefault ? '0%' : '100%',
              duration: buttonTextDuration,
              ease: 'buttonEase',
            }
          );
        }
      }, 10);
    });
    // on hoverOut...
    link.addEventListener('mouseleave', () => {
      const reverseInterval = setInterval(function () {
        if (!lineAnimation.isActive()) {
          clearInterval(reverseInterval);
          if (hideLineByDefault) {
            lineAnimation = gsap.to(underline, {
              x: '100%',
              duration: buttonTextDuration,
              ease: 'buttonEase',
            });
          } else {
            lineAnimation = gsap.fromTo(
              underline,
              {
                x: '-100%',
              },
              {
                x: '0%',
                duration: buttonTextDuration,
                ease: 'buttonEase',
                overwrite: false,
              }
            );
          }
        }
      }, 10);
    });
  });
  // ————— LINK BUTTON HOVER ANIMATION ————— //

  // ————— LOGO SLIDER MARQUEE ————— //
  document.querySelectorAll('.logos_component').forEach((item) => {
    // clone slideWrapper to fill up space
    item.querySelector('.logos_wrapper').append(item.querySelector('.logos_list').cloneNode(true));
    item.querySelector('.logos_wrapper').append(item.querySelector('.logos_list').cloneNode(true));

    let tl = gsap.timeline({ repeat: -1, onReverseComplete: () => tl.progress(1) });

    matchMedia.add('(max-width: 768px)', () => {
      tl.to(item.querySelectorAll('.logos_list'), {
        xPercent: -100,
        duration: 40,
        ease: 'none',
      });
    });
    matchMedia.add('(min-width: 769px)', () => {
      tl.to(item.querySelectorAll('.logos_list'), { xPercent: -100, duration: 60, ease: 'none' });
    });

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
  // ————— LOGO SLIDER MARQUEE ————— //

  // ————— FORM INPUT FOCUS STATE ————— //
  document.querySelectorAll('.form_input').forEach((input) => {
    input.addEventListener('focus', () => {
      input.nextSibling.style.opacity = 1;
    });
    input.addEventListener('blur', () => {
      input.nextSibling.style.opacity = 0.4;
    });
  });
  // ————— FORM INPUT FOCUS STATE ————— //

  // ————— OPEN DROPDOWN ON PAGE LOAD ————— //
  const identifier = sessionStorage['fc-dropdown-toggle'];

  if (identifier !== undefined) {
    const toggles = document.querySelectorAll('[fc-dropdown-toggle]');
    let toggleIdentifiers = [];
    for (const toggle of toggles) toggleIdentifiers.push(toggle.getAttribute('fc-dropdown-toggle'));

    for (let i = 0; i < toggleIdentifiers.length; i++) {
      if (identifier === toggleIdentifiers[i]) {
        const toggleToTrigger = toggles[i];
        toggleToTrigger.dispatchEvent(new Event('mousedown'));
        toggleToTrigger.dispatchEvent(new Event('mouseup'));
        toggleToTrigger.dispatchEvent(new Event('tap'));
      }
    }
  } else {
    const dropdowns = document.querySelectorAll('[fc-dropdown = default]');

    if (dropdowns.length === 1) {
      const dropdown = dropdowns[0];
      const dropdownToggle = dropdown.querySelector('.w-dropdown-toggle');

      dropdownToggle.dispatchEvent(new Event('mousedown'));
      dropdownToggle.dispatchEvent(new Event('mouseup'));

      $(dropdownToggle).trigger('tap');
    } else if (dropdowns.length > 1) {
      let options = {
        threshold: 0,
      };

      let callback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const dropdownToggle = entry.target.querySelector('.w-dropdown-toggle');
            if (!dropdownToggle.classList.contains('w--open')) {
              dropdownToggle.dispatchEvent(new Event('mousedown'));
              dropdownToggle.dispatchEvent(new Event('mouseup'));
              toggleToTrigger.dispatchEvent(new Event('tap'));
            }
          }
        });
      };

      let observer = new IntersectionObserver(callback, options);
      for (const dropdown of dropdowns) observer.observe(dropdown);
    }
  }
  // ————— OPEN DROPDOWN ON PAGE LOAD ————— //

  // ————— PRELOADER COMPONENT ————— //
  let preloaderAnimation = gsap.timeline();
  document.querySelectorAll('.preloader_component').forEach((preloader) => {
    gsap.set(preloader, { display: 'flex' });
    preloaderAnimation
      .to(preloader.querySelectorAll('.preloader_panel'), {
        scaleY: 0,
        transformOrigin: function (index, target, targets) {
          return index % 2 ? 'center bottom' : 'center top';
        },
        stagger: {
          each: 0.015,
          from: 'start',
        },
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      })
      .to(
        preloader.querySelector('.preloader_absolute'),
        {
          opacity: 0,
          delay: 0,
        },
        '<'
      )
      .set(preloader, {
        opacity: 0,
        display: 'none',
        duration: 0,
      });
  });

  document.querySelectorAll('a').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      if (
        this.hostname === window.location.host &&
        this.getAttribute('href').indexOf('#') === -1 &&
        this.getAttribute('target') !== '_blank'
      ) {
        e.preventDefault();
        const destination = this.getAttribute('href');
        const preloader = document.querySelector('.preloader_component');
        const panels = preloader.querySelectorAll('.preloader_panel');

        gsap.set(preloader, { opacity: 1, display: 'flex' });
        gsap.to(panels, {
          scaleY: 1,
          transformOrigin: function (index, target, targets) {
            return index % 2 ? 'center bottom' : 'center top';
          },
          stagger: {
            each: 0.015,
            from: 'start',
          },
          duration: 0.8,
          ease: 'power3.out',
          onComplete: () => {
            window.location = destination;
          },
        });
        gsap.to(preloader.querySelector('.preloader_absolute'), {
          opacity: 1,
          delay: 0.9,
        });
      }
    });
  });

  // On click of the back button
  window.onpageshow = function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  };
  // ————— PRELOADER COMPONENT ————— //

  // ————— HORIZONTAL DIVIDER COMPONENT ————— //
  document.querySelectorAll('.divider_component.is-horizontal').forEach((element) => {
    gsap.set(element.querySelectorAll('.line-horizontal'), {
      scaleX: 0,
    });
    gsap.set(element.querySelectorAll('.icon-star'), {
      opacity: 0,
      scale: 1.4,
    });

    ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      end: 'bottom 10%',
      toggleActions: 'play none resume reverse',
      onEnter: () => {
        gsap
          .timeline()
          .to(element.querySelectorAll('.line-horizontal'), {
            duration: 1.4,
            scaleX: 1,
            ease: 'power1.inOut',
            delay: Math.abs(
              ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
                preloaderAnimation.totalDuration()) *
                preloaderDelay
            ),
          })
          .to(
            element.querySelectorAll('.icon-star'),
            {
              duration: 0.8,
              opacity: 1,
              scale: 1,
            },
            '<'
          );
      },
    });
  });
  // ————— HORIZONTAL DIVIDER COMPONENT ————— //

  // ————— VERTICAL DIVIDER COMPONENT ————— //
  document.querySelectorAll('.line-vertical').forEach((line) => {
    gsap.set(line, {
      scaleY: 0,
      opacity: 0,
      transformOrigin: 'center top',
    });

    ScrollTrigger.create({
      trigger: line,
      start: 'bottom 95%',
      onEnter: () => {
        gsap.to(line, {
          scaleY: 1,
          opacity: 1,
          duration: 1,
          delay:
            Math.abs(
              ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
                preloaderAnimation.totalDuration()) *
                preloaderDelay
            ) + 0.25,
          ease: 'ease.out',
        });
      },
    });
  });
  // ————— VERTICAL DIVIDER COMPONENT ————— //

  // ————— HEADING WITH STAR COMPONENT ————— //
  document.querySelectorAll('.star-heading_component').forEach((item) => {
    const text = new SplitType(item.querySelector('h2'), {
      types: 'chars, words',
      tagName: 'span',
    });

    gsap.set(text.chars, {
      x: '-0.2rem',
      opacity: 0,
    });
    gsap.set(
      item.querySelector('.icon-star'),
      {
        opacity: 0,
        scale: 1.2,
      },
      '<'
    );

    ScrollTrigger.create({
      trigger: item,
      start: 'bottom 90%',
      end: 'bottom top',
      onEnter: () => {
        gsap
          .timeline()
          .to(text.chars, {
            x: '0rem',
            opacity: 1,
            stagger: 0.02,
            ease: 'power4.out',
            duration: 1.6,
            delay:
              Math.abs(
                ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
                  preloaderAnimation.totalDuration()) *
                  preloaderDelay
              ) + 0.4,
          })
          .to(
            item.querySelector('.icon-star'),
            {
              opacity: 1,
              scale: 1,
              ease: 'power4.out',
              duration: 1.2,
            },
            '<'
          );
      },
    });
  });

  let object = {
      value: 1,
    },
    tl = gsap.timeline({
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
  // ————— HEADING WITH STAR COMPONENT ————— //

  // ————— GlOBAL IMAGE PARALLAX EFFECT ————— //
  document.querySelectorAll('img[data-effect=parallax]').forEach((image) => {
    gsap.set(image, { scale: 1.15, opacity: 0.05 });
    // fade in
    ScrollTrigger.create({
      trigger: image.parentNode,
      start: 'top bottom',
      end: 'bottom top',
      toggleActions: 'play none resume reverse',
      onEnter: () => {
        gsap.to(image, {
          opacity: 1,
          duration: 1.4,
          delay: Math.abs(
            ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
              preloaderAnimation.totalDuration()) *
              preloaderDelay
          ),
          ease: 'ease.out',
        });
      },
    });

    // parallax effect on y scroll
    gsap.fromTo(
      image,
      {
        yPercent: -7.5,
      },
      {
        yPercent: 7.5,
        ease: 'none',
        scrollTrigger: {
          trigger: image.parentNode,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          toggleActions: 'play none resume reverse',
        },
      }
    );
  });
  // ————— GlOBAL IMAGE PARALLAX EFFECT ————— //

  // ————— GlOBAL TITLE ANIMATION EFFECT ————— //

  if (document.querySelectorAll('[split-type=title]').length > 0) {
    const titleInterval = setInterval(() => {
      if (documents.fonts.check('16px PP Pangaia')) {
        clearInterval(titleInterval);

        document.querySelectorAll('[split-type=title]').forEach((title) => {
          const headingText = new SplitType(title, {
            types: 'lines, chars, words',
            tagName: 'span',
          });

          gsap.set(headingText.chars, {
            rotateZ: 1,
            rotateX: 40,
            rotateY: 20,
            yPercent: 12,
            transformOrigin: 'left bottom',
            opacity: 0,
          });

          ScrollTrigger.create({
            trigger: headingText.elements,
            start: 'top bottom',
            end: 'bottom top',
            onEnter: () => {
              gsap.to(headingText.chars, {
                duration: 1.4,
                rotateZ: 0,
                rotateX: 0,
                rotateY: 0,
                yPercent: 0,
                opacity: 1,
                delay: Math.abs(
                  ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
                    preloaderAnimation.totalDuration()) *
                    preloaderDelay
                ),
                stagger: 0.04,
                ease: 'power1.out',
              });
            },
          });
        });
      }
    }, 50);
  }
  // ————— GlOBAL TITLE ANIMATION EFFECT ————— //

  // ————— ITEM COUNT TEXT ————— //
  if (document.querySelector('.hero-text_item-count')) {
    gsap.from('.hero-text_item-count', {
      yPercent: 25,
      opacity: 0,

      delay:
        Math.abs(
          ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
            preloaderAnimation.totalDuration()) *
            preloaderDelay
        ) + 0.75,
    });
  }
  // ————— ITEM COUNT TEXT ————— //

  // ————— ABOUT PAGE TEXT ANIMATION ————— //
  if (document.querySelector('.full-screen-hero_component .heading-size-xsmall')) {
    gsap.from('.full-screen-hero_component .heading-size-xsmall', {
      yPercent: 50,
      opacity: 0,
      delay:
        Math.abs(
          ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
            preloaderAnimation.totalDuration()) *
            preloaderDelay
        ) + 0.7,
      rotateZ: 1,
      duration: 0.6,
      transformOrigin: 'left center',
      ease: 'power2.out',
    });
  }
  // ————— ABOUT PAGE TEXT ANIMATION ————— //

  // ————— GlOBAL SUBTITLE ANIMATION EFFECT ————— //

  if (document.querySelectorAll('[split-type=subtitle]').length > 0) {
    const subtitleInterval = setInterval(() => {
      if (documents.fonts.check('16px GT America')) {
        clearInterval(subtitleInterval);

        document.querySelectorAll('[split-type=subtitle]').forEach((element) => {
          const subheading = new SplitType(element, { types: 'lines', tagName: 'span' });

          gsap.set(subheading.lines, {
            yPercent: 50,
            opacity: 0,
            rotationZ: 1,
          });

          ScrollTrigger.create({
            trigger: subheading.elements,
            start: 'bottom bottom',
            onEnter: () => {
              gsap.to(subheading.lines, {
                yPercent: 0,
                opacity: 1,
                rotationZ: 0,
                duration: 1,
                delay: Math.abs(
                  ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
                    preloaderAnimation.totalDuration()) *
                    preloaderDelay
                ),
                ease: 'quart.out',
                stagger: 0.15,
              });
            },
          });
        });
      }
    }, 50);
  }
  // ————— GlOBAL SUBTITLE ANIMATION EFFECT ————— //

  // ————— GlOBAL FAQ ELEMENT ————— //
  document.querySelectorAll('.dropdown_component, .discover_item').forEach((dropdown) => {
    const line = dropdown.querySelector('.line-horizontal'),
      icon = dropdown.querySelector('.icon-star svg'),
      heading = new SplitType(dropdown.querySelector('.text-size-regular'), {
        types: 'words, chars',
        tagName: 'span',
      }),
      answerList = dropdown.querySelector('.dropdown_list') || null;

    gsap.set(line, {
      scaleX: 0,
      opacity: 0,
      transformOrigin: 'left',
    });
    gsap.set(heading.words, {
      opacity: 0,
      yPercent: 50,
      duration: 0,
      rotateZ: 1,
    });
    if (answerList) {
      gsap.set(answerList, { opacity: 0 });
    }
    gsap.set(icon, {
      opacity: 0,
    });

    ScrollTrigger.create({
      trigger: dropdown,
      start: 'top 95%',
      end: 'bottom top',
      onEnter: () => {
        gsap
          .timeline()
          .to(line, {
            scaleX: 1,
            opacity: 0.4,
            duration: 1.2,
            ease: 'ease.in',
            delay: Math.abs(
              ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
                preloaderAnimation.totalDuration()) *
                preloaderDelay
            ),
          })
          .to(
            heading.words,
            {
              opacity: 1,
              rotateZ: 0.5,
              stagger: 0.015,
              yPercent: 0,
              duration: 0.8,
              ease: 'power2.out',
            },
            '<'
          )
          .to(answerList, { delay: 0.35, duration: 1.2, opacity: 1 }, '<')
          .to(
            icon,
            {
              duration: 1,
              opacity: 1,
            },
            '<+0.2'
          );
      },
    });

    dropdown.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        duration: 0.25,
        scale: 1.25,
        ease: 'power3.out',
      });
    });
    dropdown.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        duration: 0.25,
        scale: 1,
        ease: 'power3.out',
      });
    });
  });
  // ————— GlOBAL FAQ ELEMENT ————— //

  // ————— QUOTE COMPONENT ANIMATION ————— //
  document.querySelectorAll('.quote_component').forEach((element) => {
    const backgroundOverlay = element.querySelector('.overlay-full'),
      blockquote = splitText(element.querySelector('blockquote')),
      author = element.querySelector('[data-name=author]'),
      role = element.querySelector('[data-name=role]'),
      company = element.querySelector('[data-name=company]');

    gsap.set(backgroundOverlay, {
      bottom: '100%',
    });
    gsap.set(blockquote.lines, {
      y: '75%',
      opacity: 0,
      rotationZ: 1,
    });
    gsap.set([author, role, company], {
      opacity: 0,
      yPercent: 10,
    });

    ScrollTrigger.create({
      markers: false,
      trigger: element,
      start: 'center bottom',
      toggleActions: 'play none resume reverse',
      onEnter: () => {
        gsap
          .timeline()
          .to(backgroundOverlay, {
            delay: Math.abs(
              ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
                preloaderAnimation.totalDuration()) *
                preloaderDelay
            ),
            bottom: '0%',
            duration: 1.4,
            ease: 'quart.out',
          })
          .to(
            blockquote.lines,
            {
              delay: 0.2,
              y: '0%',
              opacity: 1,
              rotationZ: 0,
              duration: 1.2,
              ease: 'back.out',
              stagger: 0.1,
            },
            '<+0.2'
          )
          .to(
            [author, role, company],
            {
              opacity: 1,
              yPercent: 0,
              stagger: 0.05,
              duration: 1.2,
            },
            '<+0.5'
          );
      },
    });
  });
  // ————— QUOTE COMPONENT ANIMATION ————— //

  // ————— SERVICES HOMEPAGE COMPONENT ————— //
  document.querySelectorAll('.what-we-do_component').forEach((element) => {
    const backgroundOverlay = element.querySelector('.overlay-full'),
      heading = splitText(element.querySelector('.heading-size-large')),
      services = element.querySelectorAll('.heading-size-small'),
      button = element.querySelector('.button');

    gsap.set(backgroundOverlay, {
      bottom: '100%',
    });
    gsap.set([heading.elements, services, button], {
      opacity: 0,
      yPercent: 10,
      rotateZ: 1,
      transformOrigin: 'left center',
    });

    ScrollTrigger.create({
      trigger: element,
      start: 'center bottom',
      toggleActions: 'play none resume reverse',
      onEnter: () => {
        gsap
          .timeline()
          .to(backgroundOverlay, {
            bottom: '0%',
            duration: 3,
            ease: 'quart.out',
            delay: Math.abs(
              ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
                preloaderAnimation.totalDuration()) *
                preloaderDelay
            ),
          })
          .to(
            [heading.elements, services, button],
            {
              opacity: 1,
              yPercent: 0,
              rotateZ: 0,
              stagger: 0.075,
              duration: 1.2,
            },
            '<+0.2'
          );
      },
    });
  });
  // ————— SERVICES HOMEPAGE COMPONENT ————— //

  // ————— SERVICE PAGE SERVICE BLOCK ————— //
  document.querySelectorAll('.services_col').forEach((column) => {
    const servicesText = column.querySelectorAll('.services_item h5');
    const serviceLines = column.querySelectorAll('.line-horizontal');

    gsap.set(serviceLines, {
      scaleX: 0,
      opacity: 0,
      transformOrigin: 'left center',
    });
    gsap.set(servicesText, {
      opacity: 0,
      yPercent: 20,
      rotateZ: 1,
    });

    ScrollTrigger.create({
      markers: false,
      trigger: column,
      start: 'top bottom',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        gsap
          .timeline({
            defaults: {
              stagger: 0.1,
              delay: 0.2,
              duration: 1,
              ease: 'power2.out',
            },
          })
          .to(serviceLines, {
            scaleX: 1,
            opacity: 0.4,
            delay: Math.abs(
              ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
                preloaderAnimation.totalDuration()) *
                preloaderDelay
            ),
          })
          .to(
            servicesText,
            {
              opacity: 1,
              yPercent: 0,
              rotateZ: 0,
            },
            '<'
          );
      },
    });
  });
  // ————— SERVICE PAGE SERVICE BLOCK ————— //

  // ————— CONTACT HERO ANIMATION ————— //

  if (document.querySelector('.hero-text_component.is-contact')) {
    gsap.from(
      [
        document.querySelector('.hero-text_component.is-contact a'),
        document.querySelector('.hero-text_component.is-contact .hero-contact_paragraph'),
      ],
      {
        opacity: 0,
        rotateZ: 0.5,
        y: '0.5rem',
        duration: 0.8,
        ease: 'power1.out',
        delay:
          Math.abs(
            ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
              preloaderAnimation.totalDuration()) *
              preloaderDelay
          ) + 0.5,
        stagger: 0.15,
      }
    );
  }
  // ————— CONTACT HERO ANIMATION ————— //

  // ————— CONTACT CARD ANIMATION ————— //
  if (document.querySelector('.contact_component')) {
    document.querySelectorAll('.contact_component').forEach((component) => {
      gsap.set(component, {
        transformOrigin: 'center bottom',
        y: '1rem',
        opacity: 0,
        scale: 0.95,
      });
      gsap.set(component.querySelectorAll('.form_input'), {
        yPercent: 125,
        stagger: 0.05,
      });
      gsap.set(component.querySelectorAll('.line-horizontal'), {
        scaleX: 0,
      });

      ScrollTrigger.create({
        trigger: component,
        start: '15% bottom',
        end: '85% top',
        toggleActions: 'play none resume reverse',
        onEnter: () => {
          gsap
            .timeline()
            .to(component, {
              y: '0rem',
              opacity: 1,
              scale: 1,
              duration: 1,
              delay:
                Math.abs(
                  ((preloaderAnimation.totalDuration() - preloaderAnimation.totalTime()) /
                    preloaderAnimation.totalDuration()) *
                    preloaderDelay
                ) + 1,
              ease: 'ease.out',
            })
            .to(
              component.querySelectorAll('.form_input'),
              {
                yPercent: 0,
                stagger: 0.05,
                delay: 0.3,
                ease: 'power3.out',
                duration: 1.2,
              },
              '<'
            )
            .to(
              component.querySelectorAll('.line-horizontal'),
              {
                scaleX: 1,
                stagger: 0.05,
                delay: 0.5,
                ease: 'ease.in',
                duration: 1.2,
              },
              '<'
            );
        },
      });
    });
  }

  // ————— CONTACT CARD ANIMATION ————— //

  // ————— NAV MENU ————— //

  // hover effect for the main navlinks inside the menu
  document.querySelectorAll('.nav_open-link').forEach((navLink) => {
    const horizontalLineLeft = navLink.previousSibling;
    const horizontalLineRight = navLink.nextSibling;
    const text = new SplitType(navLink, {
      types: 'chars',
      tagName: 'span',
    });

    gsap.set([horizontalLineLeft, horizontalLineRight], { scaleX: 0 });

    navLink.addEventListener('mouseenter', () => {
      gsap.to([horizontalLineLeft, horizontalLineRight], { scaleX: 1 });
      gsap.to(text.chars, {
        duration: 0.2,
        ease: 'ease.out',
        xPercent: (index, target, targets) => {
          let centerIndex = Math.floor(targets.length / 2);
          let movePercentage;
          const percentage = 2;

          if (index < centerIndex) {
            movePercentage = -percentage * Math.abs(index - centerIndex);
          } else if (index > centerIndex) {
            movePercentage = percentage * Math.abs(index - centerIndex);
          } else {
            movePercentage = 0;
          }

          return movePercentage;
        },
      });
    });
    navLink.addEventListener('mouseleave', () => {
      gsap.to([horizontalLineLeft, horizontalLineRight], { scaleX: 0 });
      gsap.to(text.chars, {
        xPercent: 0,
      });
    });
  });

  // open nav_menu
  let menuAnimation = gsap.timeline({});
  const menuLinks = document.querySelectorAll('.nav_open-link-wrap');
  const menuDetails = document.querySelectorAll('.nav_bottom_item');
  const menuWrap = document.querySelector('.nav_open');
  const menuBg = document.querySelector('.nav_open-background');
  let isOpen = false;

  const menuLinkTextPre = new SplitType(
    document.querySelectorAll('.link_component.is-menu .text-size-regular')[0],
    {
      types: 'chars',
      tagName: 'span',
    }
  );
  const menuLinkTextPost = new SplitType(
    document.querySelectorAll('.link_component.is-menu .text-size-regular')[1],
    {
      types: 'chars',
      tagName: 'span',
    }
  );

  // animation to change the menu button text from 'MENU' to 'CLOSE'
  const menuLinkTextAnimation = gsap
    .timeline({})
    .to(menuLinkTextPre.chars, {
      yPercent: -100,
      stagger: 0.0175,
      duration: buttonTextDuration,
      ease: 'buttonEase',
    })
    .to(
      menuLinkTextPost.chars,
      {
        yPercent: -100,
        stagger: 0.0175,
        duration: buttonTextDuration,
        ease: 'buttonEase',
      },
      '<'
    )
    .pause();

  let menuOpen = () => {
    isOpen = true;

    menuLinkTextAnimation.play();

    menuAnimation.clear();
    menuAnimation.progress(0);
    menuAnimation
      .set(menuWrap, { display: 'flex' })
      .fromTo(
        menuBg,
        { height: 0 },
        { height: '100%', ease: 'power3.out', duration: 1, transformOrigin: 'center top' }
      )
      .fromTo(
        menuLinks,
        {
          opacity: 0,
          yPercent: 20,
          rotateZ: 1,
        },
        {
          opacity: 1,
          yPercent: 0,
          rotateZ: 0,
          duration: 0.6,
          ease: 'power1.out',
          stagger: { each: 0.075, from: 'start' },
        },
        '<+0.35'
      )
      .fromTo(
        menuDetails,
        {
          opacity: 0,
          yPercent: 50,
          rotateZ: 1,
        },
        {
          rotateZ: 0,
          opacity: 1,
          yPercent: 0,
          duration: 0.6,
          ease: 'power1.out',
          stagger: { each: 0.05, from: 'start' },
        },
        '<+0.5'
      );
  };

  let menuClose = () => {
    menuLinkTextAnimation.reverse();

    menuAnimation.clear();
    menuAnimation.progress(0);
    menuAnimation
      .to(menuLinks, {
        opacity: 0,
        yPercent: 20,
        duration: 0.2,
        ease: 'power1.out',
        stagger: { each: 0.075, from: 'end' },
      })
      .to(
        menuDetails,
        {
          opacity: 0,
          yPercent: 25,
          duration: 0.3,
          ease: 'power1.out',
          stagger: { each: 0.01, from: 'start' },
        },
        0
      )
      .to(
        menuBg,
        {
          height: 0,
          ease: 'power2.out',
          duration: 1,
        },
        '<+0.25'
      )
      .set(menuWrap, {
        display: 'none',
        onComplete: () => {
          isOpen = false;
        },
      });
  };

  document.querySelector('.nav_menu-button').addEventListener('click', () => {
    if (isOpen) {
      menuClose();
      lenis.start();
    } else {
      menuOpen();
      lenis.stop();
    }
  });
  // ————— NAV MENU ————— //

  // ————— PREFOOTER CARD ————— //

  // paralllax the large text on Y scroll
  gsap.from('.pre-footer_component .heading-size-xxlarge.is-footer', {
    scale: 0.965,
    duration: 1.4,
    yPercent: 2,
    transformOrigin: (index) => {
      return index % 2 ? 'center top' : 'center bottom';
    },
    ease: 'power1.out',
    scrollTrigger: {
      scrub: true,
      trigger: '.pre-footer_component .center-card_component',
      start: 'top bottom',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
    },
  });

  // fade in the card on intoView
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.pre-footer_component .center-card_component',
        start: '25% bottom',
        toggleActions: 'play none none reverse',
        markers: false,
      },
    })
    .from(
      '.pre-footer_component .overlay-full',
      {
        bottom: '100%',
        duration: 1,
        ease: 'power3.out',
      },
      '<'
    )
    .from(
      ['.pre-footer_component .center-card_button', '.pre-footer_component .heading-size-medium'],
      {
        opacity: 0,
        duration: 1,
        y: '0.25rem',
        scale: 0.99,
        ease: 'power1.out',
      },
      '<+0.45'
    );

  // card hover animation
  const contactCard = document.querySelector('.pre-footer_component .center-card_component');
  const contactCardButton = contactCard.querySelector('.pre-footer_component .center-card_button');
  let isCopied = false;
  const contactCardAnimationDuration = 0.35;

  const contactCardAnimation = gsap
    .timeline({
      defaults: { duration: contactCardAnimationDuration, ease: 'power2.inOut' },
    })
    .to(contactCardButton.querySelectorAll('div')[0], {
      yPercent: -100,
    })
    .to(
      contactCardButton.querySelectorAll('div')[1],
      {
        yPercent: -100,
      },
      '<'
    )
    .to(contactCardButton.querySelectorAll('div')[1], {
      yPercent: -200,
    })
    .to(
      contactCardButton.querySelectorAll('div')[2],
      {
        yPercent: -100,
      },
      '<'
    )
    .to(contactCardButton.querySelectorAll('div')[2], {
      yPercent: -200,
    })
    .to(
      contactCardButton.querySelectorAll('div')[3],
      {
        yPercent: -100,
      },
      '<'
    )
    .pause();

  // copy the email
  let clipboard = new ClipboardJS(contactCard);
  clipboard.on('success', function (e) {
    contactCardAnimation.tweenTo(contactCardAnimationDuration * 2);
    isCopied = true;
    setTimeout(
      () => {
        contactCardAnimation.tweenTo(contactCardAnimationDuration * 3, {
          onComplete: () => {
            contactCardAnimation.seek(0);
          },
        });
        isCopied = false;
      },
      contactCardAnimationDuration * 1000 * 4
    );
  });

  contactCard.addEventListener('mouseenter', (element) => {
    if (!isCopied) contactCardAnimation.tweenFromTo(0, contactCardAnimationDuration);
    gsap.to(contactCard, { scale: 1.01, ease: 'ease.inOut', duration: 0.3 });
  });

  contactCard.addEventListener('mouseleave', (element) => {
    if (!isCopied) contactCardAnimation.reverse();
    gsap.to(contactCard, { scale: 1, ease: 'ease.inOut', duration: 0.2 });
  });
  // ————— PREFOOTER CARD ————— //
});
