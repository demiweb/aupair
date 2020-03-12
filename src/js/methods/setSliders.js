import { tns } from 'tiny-slider/src/tiny-slider'
import classNames from '../classNames'
import setLazy from './setLazy'

export default function setSliders() {
  const sliders = [...document.querySelectorAll(`.${classNames.slider.container}`)]
  if (!sliders.length) return

  const [homeSlider] = sliders.filter(slider => slider.dataset.slider === 'home')
  if (!homeSlider) return

  tns({
    container: homeSlider,
    onInit: setLazy,
    items: 1,
    // autoplay: true,
    // loop: false,
    controls: false,
    mouseDrag: true,
  })
}
