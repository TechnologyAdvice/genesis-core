import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './styles/main.scss'

class App extends React.Component<undefined, undefined> {
  render () {
    return (
      <h1>Welcome to Genesis Core</h1>
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(<App />, root)
