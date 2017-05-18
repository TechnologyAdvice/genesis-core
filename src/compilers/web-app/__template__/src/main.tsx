import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './styles/main.scss'

const APP_ROOT = document.getElementById('root')!

let render = () => {
  const App = require('./components/App').default
  ReactDOM.render(<App />, APP_ROOT)
}

if (__DEV__) {
  if (module.hot) {
    const renderApp = render
    render = () => {
      try {
        renderApp()
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
      }
    }

    module.hot.accept([
      './src/components/App'
    ], () => {
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(APP_ROOT)
        render()
      })
    })
  }
}

render()
