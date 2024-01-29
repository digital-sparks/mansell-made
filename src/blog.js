import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

window.Webflow ||= [];
window.Webflow.push(() => {
  document.querySelectorAll('.blog_item-wrap').forEach((article) => {
    const animation = gsap
      .timeline()
      .fromTo(
        article.querySelector('.blog_image-wrap'),
        { scale: 1 },
        {
          scale: 0.95,
          ease: 'power1.out',
          duration: 0.3,
        }
      )
      .fromTo(
        article.querySelector('img'),
        { scale: 1 },
        {
          scale: 1.05,
          duration: 0.4,
          ease: 'power1.out',
        },
        '<'
      )
      .pause();

    article.addEventListener('mouseenter', () => {
      animation.play();
    });

    article.addEventListener('mouseleave', () => {
      animation.reverse();
    });
  });

  function itemsCount() {
    let renderCount = document.querySelector('.blog_list').childElementCount;
    let countEl = document.querySelector('.hero-text_item-count');
    if (renderCount < 10) {
      renderCount = '0' + renderCount;
    }
    countEl.textContent = renderCount;
  }

  itemsCount();

  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsfilter',
    (filterInstances) => {
      console.log('cmsfilter Successfully loaded!');

      const [filterInstance] = filterInstances;

      filterInstance.listInstance.on('renderitems', (renderedItems) => {
        itemsCount();
      });
    },
  ]);
});
