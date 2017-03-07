import React from 'react'
import ReactDOM from 'react-dom'
import './styles/main.scss'

class App extends React.Component {
  render () {
    return (
      <h1>Hi</h1>
    )
  }
}

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

ReactDOM.render(<App />, root)