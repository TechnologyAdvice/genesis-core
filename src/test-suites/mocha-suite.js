import chai from 'chai'
import sinon from 'sinon'
import dirtyChai from 'dirty-chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import * as enzyme from 'enzyme'
import chaiEnzyme from 'chai-enzyme'

// Mocha / Chai
// ------------------------------------
chai.should()

global.chai = chai
global.expect = chai.expect
global.sinon = sinon

// Chai Plugins
// ------------------------------------
chai.use(chaiEnzyme())
chai.use(chaiAsPromised)
chai.use(dirtyChai)
chai.use(sinonChai)

// Enzyme
// ------------------------------------
global.shallow = enzyme.shallow
global.render = enzyme.render
global.mount = enzyme.mount

// Sinon Sandbox
// ------------------------------------
global.sandbox = sinon.sandbox.create()

afterEach(() => global.sandbox.restore())
