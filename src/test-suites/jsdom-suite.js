const { JSDOM } = require('jsdom')

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
})
const { window } = jsdom

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop))
  Object.defineProperties(target, props)
}

global.window = window
global.document = window.document
global.navigator = window.navigator

// HACK(zuko): Fixes Emoji component
window.getComputedStyle = window.getComputedStyle || (() => {})

// HACK(zuko): Fixes SUIR
global.window.localStorage = window.localStorage || {}

// HACK(zuko): Fixes brace
window.URL = window.URL || {}
window.URL.createObjectURL = window.URL.createObjectURL || (() => {})

// https://github.com/chaijs/type-detect/issues/98
global.HTMLElement = window.HTMLElement

copyProps(window, global)
