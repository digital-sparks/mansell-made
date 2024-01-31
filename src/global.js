import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { _horizontal } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import CustomEase from 'gsap/CustomEase';
import SplitType from 'split-type';
import ClipboardJS from 'clipboard';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(Observer);

CustomEase.create('button', '1, 0, .25, 1');

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

    // recalculate page height when FAQ dropdown is opened
    document.querySelectorAll('.dropdown_component').forEach((dropdown) => {
      dropdown.addEventListener('click', () => {
        setTimeout(() => {
          lenis.resize();
        }, 750); // timeout value is set to faq interaction duration
      });
    });
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
        duration: 2,
        scaleX: 0,
        ease: 'ease.in',
      })
      .from(
        element.querySelectorAll('.icon-star'),
        {
          duration: 0.6,
          opacity: 0,
          scale: 1.5,
        },
        '<'
      );
  });

  // ————— DIVIDER COMPONENT ————— //

  CustomEase.create('linkUnderline', '1, 0, .25, 1');
  const linkUnderlineDuration = 0.6;

  document.querySelectorAll('.link_component').forEach((link) => {
    const hideLineByDefault = link.classList.contains('is-line-initial-left');
    const isMenuButton = link.classList.contains('is-menu');

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
    const letterAnimation = gsap
      .timeline({})
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

    let lineAnimation = gsap.set(underline, {});

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
              duration: linkUnderlineDuration,
              ease: 'linkUnderline',
            }
          );
        }
      }, 10);
    });
    link.addEventListener('mouseleave', () => {
      const reverseInterval = setInterval(function () {
        if (!lineAnimation.isActive()) {
          clearInterval(reverseInterval);
          if (hideLineByDefault) {
            lineAnimation = gsap.to(underline, {
              x: '100%',
              duration: linkUnderlineDuration,
              ease: 'linkUnderline',
            });
          } else {
            lineAnimation = gsap.fromTo(
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
      }, 10);
    });
  });

  // ————— NAV MENU ————— //

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
        duration: 0.4,
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

  let menuAnimation = gsap.timeline({});
  const menuLinks = document.querySelectorAll('.nav_open-link-wrap');
  const menuDetails = document.querySelectorAll('.nav_bottom_item');
  const menuWrap = document.querySelector('.nav_open');
  const menuBg = document.querySelector('.menu-bg');
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

  console.log(menuLinkTextPre);
  console.log(menuLinkTextPost);

  const menuLinkTextAnimation = gsap
    .timeline({})
    .to(menuLinkTextPre.chars, {
      yPercent: -100,
      stagger: 0.02,
      duration: 1,
      ease: 'button',
    })
    .to(
      menuLinkTextPost.chars,
      {
        yPercent: -100,
        stagger: 0.02,
        duration: 1,
        ease: 'button',
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
        menuWrap,
        { height: 0 },
        { height: 'auto', ease: 'power2.inOut', duration: 1, transformOrigin: 'center top' }
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
          stagger: { each: 0.1, from: 'start' },
        },
        '<+0.9'
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
          duration: 0.8,
          ease: 'power1.out',
          stagger: { each: 0.05, from: 'start' },
        },
        '<+0.6'
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
        stagger: { each: 0.1, from: 'end' },
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
        menuWrap,
        {
          height: 0,
          ease: 'power2.inOut',
          duration: 0.8,
        },
        '<+0.7'
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
        markers: false,
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
      if (!animation.isActive()) animation.seek(0);
      animation.play();
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
          markers: false,
          toggleActions: 'play none none reverse',
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
        duration: 1.2,
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

  gsap.from('.heading-size-xxlarge.is-footer', {
    scale: 0.965,
    duration: 1.4,
    yPercent: 2,
    transformOrigin: (index) => {
      return index % 2 ? 'center top' : 'center bottom';
    },
    ease: 'power1.out',
    scrollTrigger: {
      scrub: true,
      trigger: '.center-card_component',
      start: 'top bottom',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
    },
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.center-card_component',
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
        ease: 'power1.out',
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
        ease: 'ease.out',
      },
      '<+0.8'
    );

  // logo slider marquee
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
      }),
      answerList = dropdown.querySelector('.dropdown_list');

    const animation = gsap
      .timeline({
        scrollTrigger: {
          markers: false,
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
        },
        '<'
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
      )
      .from(answerList, { delay: 0.2, duration: 1.2, opacity: 0 }, '<')
      .from(
        icon,
        {
          duration: 1,
          opacity: 0,
        },
        '>-0.2'
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
        toggleActions: 'play none none none',
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
        toggleActions: 'play none none none',
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
        toggleActions: 'play none none none',
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
          return index % 2 ? 'center bottom' : 'center top';
        },
        stagger: {
          each: 0.01,
          from: 'center',
        },
        duration: 1.6,
        ease: 'power3.inOut',
      })
      .to(
        preloader.querySelector('.preloader_absolute'),
        {
          opacity: 0,
          delay: 0.6,
        },
        '<'
      )
      .set(preloader, {
        opacity: 0,
        display: 'none',
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
            each: 0.01,
            from: 'center',
          },
          duration: 1.6,
          ease: 'power3.inOut',
          onComplete: () => {
            window.location = destination;
          },
        });
        gsap.to(preloader.querySelector('.preloader_absolute'), {
          opacity: 1,
          delay: 0.8,
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

  const contactCard = document.querySelector('.center-card_component');
  const contactCardButton = contactCard.querySelector('.center-card_button');
  let isCopied = false;

  const contactCardAnimation = gsap
    .timeline({
      defaults: { duration: 0.5, ease: 'power1.inOut' },
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

  let clipboard = new ClipboardJS(contactCard);
  clipboard.on('success', function (e) {
    contactCardAnimation.tweenTo(1);
    isCopied = true;
    setTimeout(() => {
      contactCardAnimation.tweenTo(1.5, {
        onComplete: () => {
          contactCardAnimation.seek(0);
        },
      });
      isCopied = false;
    }, 2000);
  });

  contactCard.addEventListener('mouseenter', (element) => {
    if (!isCopied) contactCardAnimation.tweenFromTo(0, 0.5);
    gsap.to(contactCard, { scale: 1.01, ease: 'power1.out', duration: 0.4 });
  });

  contactCard.addEventListener('mouseleave', (element) => {
    if (!isCopied) contactCardAnimation.reverse();
    gsap.to(contactCard, { scale: 1, ease: 'power1.out', duration: 0.2 });
  });

  // open dropdown on page load
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

        $(toggleToTrigger).trigger('tap');
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

              $(dropdownToggle).trigger('tap');
            }
          }
        });
      };

      let observer = new IntersectionObserver(callback, options);

      for (const dropdown of dropdowns) observer.observe(dropdown);
    }
  }
});
