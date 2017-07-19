import './jsdom-setup'
import chai from 'chai'
import sinon from 'sinon'
import dirtyChai from 'dirty-chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
// import enzyme from 'enzyme'
// import chaiEnzyme from 'chai-enzyme'

// Mocha / Chai
// ------------------------------------
chai.should()

global.chai = chai
global.expect = chai.expect
global.sinon = sinon

// Chai Plugins
// ------------------------------------
// chai.use(chaiEnzyme())
// global.enzyme = enzyme
// global.shallow = enzyme.shallow
// global.render = enzyme.render
// global.mount = enzyme.mount

chai.use(chaiAsPromised)
chai.use(dirtyChai)
chai.use(sinonChai)

// Sinon Sandbox
// ------------------------------------
global.sandbox = sinon.sandbox.create()
const stub = global.sandbox.stub.bind(global.sandbox)

afterEach(() => global.sandbox.restore())

// We use a Webpack global here as it is replaced with a string during compile.
// Using a regular JS variable is not statically analyzable so webpack will throw warnings.
const testsContext = require.context(__TESTS_ROOT__, true, __TESTS_PATTERN__)
testsContext.keys().forEach(testsContext)
