import React from 'react'

describe('Sample Tests', () => {
  it('has access to "expect"', () => {
    expect('foo').to.equal('foo')
  })

  it('has access to "should"', () => {
    'bar'.should.equal('bar')
  })

  it('works with enzyme', () => {
    const App = () => <p>hello</p>
    expect(shallow(<App />).text()).to.equal('hello')
  })

  it('works with chai-enzyme', () => {
    const App = () => <p>hello</p>
    expect(shallow(<App />)).to.have.text('hello')
  })
})
