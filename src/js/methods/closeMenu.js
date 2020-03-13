import classNames from '../classNames'

export default function closeMenu({ menu }) {
  function close(e) {
    const nav = e.target.closest(`.${classNames.menu.menu}`)
    const btn = e.target.closest(`.${classNames.menu.burger}`)

    if (nav || btn) return

    menu.close()
  }

  document.addEventListener('click', close)
}
