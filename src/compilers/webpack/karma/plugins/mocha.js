import chai from 'chai'
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'

global.chai = chai
global.expect = chai.expect
chai.should()
chai.use(chaiAsPromised)
chai.use(sinonChai)

// Mocha (karma browser global)
// ------------------------------------
mocha.setup({
  ui: 'bdd',
})

// Sinon
// ------------------------------------
global.sinon = sinon
global.sandbox = sinon.sandbox.create()

afterEach(() => global.sandbox.restore())
