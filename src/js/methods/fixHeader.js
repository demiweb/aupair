import { throttle } from 'throttle-debounce'
import { BEMblock } from '../helpers'
import { IS_FIXED } from '../constants'

export default function fixHeader(app) {
  const { header, body: BODY } = app.dom

  function scrollHandler() {
    if (!header) return
    const headerBottom = header.querySelector('.header__bottom')
    if (!headerBottom) return

    if (window.pageYOffset >= headerBottom.offsetHeight) {
      BEMblock(headerBottom, 'header__bottom').addMod(IS_FIXED)
      BODY.style.paddingTop = `${headerBottom.offsetHeight}px`
    } else {
      BEMblock(headerBottom, 'header__bottom').removeMod(IS_FIXED)
      BODY.style.paddingTop = ''
    }
  }

  const onScroll = throttle(66, scrollHandler)
  window.addEventListener('scroll', onScroll)
}
