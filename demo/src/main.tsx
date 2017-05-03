import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './styles/main.scss'

const MOUNT_NODE = document.createElement('div')
document.body.appendChild(MOUNT_NODE)

let render = () => {
  const App = require('./components/App').default
  ReactDOM.render(<App />, MOUNT_NODE)
}

if (__DEV__) {
  if (module['hot']) {
    const renderApp = render
    render = () => {
      try {
        renderApp()
      } catch (e) {
        console.error(e)
      }
    }

    module['hot'].accept('./components/App', () => {
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    })
  }
}
render()
