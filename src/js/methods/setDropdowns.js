import classNames from '../classNames'
import { BEMblock, slideDown, slideUp } from '../helpers'
import { IS_OPEN, IS_ACTIVE } from '../constants'

export default () => {
  const onTransitionEnd = e => {
    const container = e.currentTarget.closest('.blocks')
    if (!container) return
    const buttons = [...container.querySelectorAll(`.${classNames.dropdown.btn}`)]

    if (!buttons.length) return

    const activeBtns = buttons.filter(btn => BEMblock(btn, 'block__btn').containsMod(IS_ACTIVE))

    buttons.forEach(button => {
      if (!activeBtns.length) {
        button.style.height = ''
      }
    })
  }

  function onClick(e) {
    const btn = e.target.closest(`.${classNames.dropdown.btn}`)
    if (!btn) return

    e.preventDefault()
    e.stopPropagation()

    const wrap = btn.closest('.block')
    const container = btn.closest('.blocks')
    if (!wrap || !container) return
    const item = wrap.querySelector(`.${classNames.dropdown.item}`)
    const allBtns = [...container.querySelectorAll(`.${classNames.dropdown.btn}`)]

    // const btnsHeights = allBtns.map(button => button.offsetHeight)

    // const btnHeight = Math.max(...btnsHeights)

    if (BEMblock(btn, 'block__btn').containsMod(IS_ACTIVE)) {
      BEMblock(btn, 'block__btn').removeMod(IS_ACTIVE)
      BEMblock(item, 'block__list-wrap').removeMod(IS_OPEN)

      slideUp(item)

      item.addEventListener('transitionend', onTransitionEnd)
    } else {
      allBtns.forEach(button => {
        const { height } = button.getBoundingClientRect()
        button.style.height = `${height}px`
      })

      BEMblock(btn, 'block__btn').addMod(IS_ACTIVE)
      BEMblock(item, 'block__list-wrap').addMod(IS_OPEN)
      slideDown(item)

      item.removeEventListener('transitionend', onTransitionEnd)
    }
  }

  document.addEventListener('click', onClick)
}
