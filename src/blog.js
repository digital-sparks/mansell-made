import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CustomEase);

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.from('.hero-text_item-count', {
    yPercent: 25,
    opacity: 0,
    delay: 1.1,
  });

  document.querySelectorAll('.blog_item-wrap').forEach((article) => {
    const animation = gsap
      .timeline()
      .fromTo(
        article.querySelector('.blog_image-wrap'),
        { scale: 1 },
        {
          scale: 0.95,
          ease: 'power3.inOut',
          duration: 0.8,
        }
      )
      .fromTo(
        article.querySelector('img'),
        { scale: 1.15 },
        {
          scale: 1.175,
          duration: 0.8,
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
