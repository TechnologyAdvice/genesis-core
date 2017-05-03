import chai from 'chai'
import enzyme from 'enzyme'
import chaiEnzyme from 'chai-enzyme'

global.enzyme = enzyme
global.shallow = enzyme.shallow
global.render = enzyme.render
global.mount = enzyme.mount

chai.use(chaiEnzyme())
