import React from 'react'
import ReactDOM from 'react-dom'
const component = require(__COMPONENT_PATH__)

// ------------------------------------
// Live Reload Persistence
// ------------------------------------
class Storage {
  set (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  get (key) {
    return JSON.parse(localStorage.getItem(key))
  }
}
const storage = new Storage()
const scenario = storage.get('active_scenario')
if (!scenario || !component.scenarios || !component.scenarios[scenario]) {
  if (scenario !== 'custom') storage.set('active_scenario', 'default')
}

// ------------------------------------
// Rendering
// ------------------------------------
const SandboxStage = ({ children, scenarios = Object.keys(component.scenarios), title }) => (
  <div>
    <h2>Scenario: {title}</h2>
    {!!scenarios.length && scenarios.map(scenario => (
      <button key={scenario} onClick={() => renderScenario(scenario)}>
        {scenario}
      </button>
    ))}
    <hr />
    <div style={{ margin: '0 auto', width: '1000px' }}>
      {children}
    </div>
  </div>
)

const renderScenario = (scenario) => {
  storage.set('active_scenario', scenario)
  let props = {}
  let comp = component.scenarios[scenario]
  if (scenario === 'custom') {
    props = storage.get('custom_scenario')
    comp = component.default
  }
  ReactDOM.render(
    <SandboxStage title={scenario}>
      {React.createElement(comp, props)}
    </SandboxStage>,
    MOUNT_NODE
  )
}

window.render = (props) => {
  storage.set('custom_scenario', props)
  renderScenario('custom')
}

// ------------------------------------
// Live Reload Setup
// ------------------------------------
module.hot.accept()
module.hot.dispose(() => {
  ReactDOM.unmountComponentAtNode(MOUNT_NODE)
  document.body.removeChild(MOUNT_NODE)
})

// ------------------------------------
// Start Sandbox
// ------------------------------------
const MOUNT_NODE = document.createElement('div')
document.body.appendChild(MOUNT_NODE)

renderScenario(storage.get('active_scenario'))
