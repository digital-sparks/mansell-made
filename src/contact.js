import SplitType from 'split-type';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

window.Webflow ||= [];
window.Webflow.push(() => {
  $('.contact_wrap .button').click(function () {
    $('.form_submit')[0].click();
  });

  $('textarea')
    .each(function () {
      this.setAttribute('style', 'height:' + this.scrollHeight + 'px;overflow-y:hidden;');
    })
    .on('input', function () {
      this.style.height = 0;
      this.style.height = this.scrollHeight + 'px';
    });

  let contactComponent = gsap
    .timeline({
      scrollTrigger: {
        trigger: '.contact_component',
        start: '15% bottom',
        end: '85% top',
        // scrub: true,
        markers: true,
        toggleActions: 'play none resume reverse',
      },
    })
    .from('.contact_component', {
      transformOrigin: 'center bottom',
      y: '1rem',
      opacity: 0,
      scale: 0.95,
      duration: 1,
      delay: 0.5,
      ease: 'ease.out',
    })
    .from(
      '.contact_component .form_input',
      {
        yPercent: 125,
        stagger: 0.05,
        delay: 0.1,
        ease: 'ease.out',
        duration: 1.2,
      },
      '<'
    )
    .from(
      '.contact_component .line-horizontal',
      {
        scaleX: 0,
        stagger: 0.05,
        delay: 0.5,
        ease: 'ease.in',
        duration: 1.2,
      },
      '<'
    );
});
