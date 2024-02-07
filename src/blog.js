import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  // ————— BLOG THUMB HOVER ————— //
  document.querySelectorAll('.blog_item-wrap').forEach((article) => {
    const animation = gsap
      .timeline()
      .fromTo(
        article.querySelector('.blog_image-wrap'),
        { scale: 1 },
        {
          scale: 0.95,
          ease: 'power3.inOut',
          duration: 0.6,
        }
      )
      .fromTo(
        article.querySelector('img'),
        { scale: 1.15 },
        {
          scale: 1.175,
          duration: 0.6,
          ease: 'power3.inOut',
        },
        '<'
      )
      .pause();

    article.addEventListener('mouseenter', () => {
      animation.timeScale(1).play();
    });

    article.addEventListener('mouseleave', () => {
      animation.timeScale(1.25).reverse();
    });
  });
  // ————— BLOG THUMB HOVER ————— //

  // ————— FINSWEET RENDER ITEMS ————— //
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsfilter',
    (filterInstances) => {
      const [filterInstance] = filterInstances;

      filterInstance.listInstance.on('renderitems', (renderedItems) => {
        let renderCount = document.querySelector('.blog_list').childElementCount;
        let countEl = document.querySelector('.hero-text_item-count');
        countEl.textContent = renderCount < 10 ? '0' + renderCount : renderCount;
      });
    },
  ]);
  // ————— FINSWEET RENDER ITEMS ————— //
});
