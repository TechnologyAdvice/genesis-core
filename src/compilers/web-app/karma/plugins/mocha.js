import chai from 'chai'
import sinon from 'sinon'
import dirtyChai from 'dirty-chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'

// Mocha / Chai
// ------------------------------------
mocha.setup({ ui: 'bdd' })
chai.should()

global.chai = chai
global.expect = chai.expect
global.sinon = sinon

// Chai Plugins
// ------------------------------------
if (__REACT__) {
  const enzyme = require('enzyme')
  const chaiEnzyme = require('chai-enzyme')

  chai.use(chaiEnzyme())
  global.enzyme = enzyme
  global.shallow = enzyme.shallow
  global.render = enzyme.render
  global.mount = enzyme.mount
}

chai.use(dirtyChai)
chai.use(chaiAsPromised)
chai.use(sinonChai)

// Sinon Sandbox
// ------------------------------------
global.sandbox = sinon.sandbox.create()
const stub = global.sandbox.stub.bind(global.sandbox)

afterEach(() => global.sandbox.restore())
