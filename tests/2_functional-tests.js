const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string', function() {
    let input = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' }
    let expected = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'
    chai.request(server)
    .post('/api/solve')
    .send(input)
    .end((err, res) => {
      assert.strictEqual(res.body.solution, expected)
    })
  })

  test('Solve a puzzle with missing puzzle string', function() {
    chai.request(server)
    .post('/api/solve')
    .end((err, res) => {
      assert.property(res.body, 'error', 'Error field required')
      assert.strictEqual(res.body.error, 'Required field missing')
    })
  })

  test('Solve a puzzle with invalid characters', function() {
    let input = { puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' }
    chai.request(server)
    .post('/api/solve')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'error', 'Error field required')
      assert.strictEqual(res.body.error, 'Invalid characters in puzzle')
    })
  })

  test('Solve a puzzle with incorrect length', function() {
    let input = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.' }
    chai.request(server)
    .post('/api/solve')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'error', 'Error field required')
      assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long')
    })
  })

  test('Solve a puzzle that cannot be solved', function() {
    let input = { puzzle: '1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' }
    chai.request(server)
    .post('/api/solve')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'error', 'Error field required')
      assert.strictEqual(res.body.error, 'Puzzle cannot be solved')
    })
  })

  test('Check a puzzle placement with all fields', function() {
    let input = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '7' }
    chai.request(server)
    .post('/api/check')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'valid', 'Valid field required')
      assert.strictEqual(res.body.valid, true)
    })
  })

  test('Check a puzzle placement with single placement conflict', function() {
    let input = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '6' }
    let expected = { valid: false, conflict: ["column"] }
    chai.request(server)
    .post('/api/check')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'valid', 'Valid field required')
      assert.strictEqual(res.body.valid, false)
      assert.property(res.body, 'conflict', 'Conflict field required')
      // assert.strictEqual(res.body.conflict, ['column'])
    })
  })

  test('Check a puzzle placement with multiple placement conflicts', function() {
    let input = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '1' }
    let expected = { valid: false, conflict: ["row", "column"] }
    chai.request(server)
    .post('/api/check')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'valid', 'Valid field required')
      assert.strictEqual(res.body.valid, false)
      assert.property(res.body, 'conflict', 'Conflict field required')
      // assert.strictEqual(res.body.conflict, expected.conflict)
    })
  })

  test('Check a puzzle placement with all placement conflicts', function() {
    let input = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'E5', value: '6' }
    let expected = { valid: false, conflict: ["row", "column", "region"] }
    chai.request(server)
    .post('/api/check')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'valid', 'Valid field required')
      assert.strictEqual(res.body.valid, false)
      assert.property(res.body, 'conflict', 'Conflict field required')
      // assert.strictEqual(res.body.conflict, expected.conflict)
    })
  })

  test('Check a puzzle placement with missing required fields', function() {
    let input = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' }
    chai.request(server)
    .post('/api/check')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'error', 'Error field required')
      assert.strictEqual(res.body.error, 'Required field(s) missing')
    })
  })

  test('Check a puzzle placement with invalid characters', function() {
    let input = { puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '1' }
    chai.request(server)
    .post('/api/check')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'error', 'Error field required')
      assert.strictEqual(res.body.error, 'Invalid characters in puzzle')
    })
  })

  test('Check a puzzle placement with incorrect length', function() {
    let input = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.', coordinate: 'A1', value: '1' }
    chai.request(server)
    .post('/api/check')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'error', 'Error field required')
      assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long')
    })
  })

  test('Check a puzzle placement with invalid placement coordinate', function() {
    let input = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'Z1', value: '1' }
    chai.request(server)
    .post('/api/check')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'error', 'Error field required')
      assert.strictEqual(res.body.error, 'Invalid coordinate')
    })
  })

  test('Check a puzzle placement with invalid placement coordinate', function() {
    let input = { puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '10' }
    chai.request(server)
    .post('/api/check')
    .send(input)
    .end((err, res) => {
      assert.property(res.body, 'error', 'Error field required')
      assert.strictEqual(res.body.error, 'Invalid value')
    })
  })
});

