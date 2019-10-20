import { transform } from 'babel-core'
import { join } from 'path'
import {expect} from 'chai';
import { readdirSync, statSync, readFileSync } from 'fs'

const FIXTURE_PATH = join(__dirname, '__fixtures__/babel')

const testFolders = readdirSync(FIXTURE_PATH).filter(file =>
  statSync(join(FIXTURE_PATH, file)).isDirectory(),
)

function testPlugin(code) {
  const result = transform(code, {
    presets: [["env", {"targets": {"node": "8.0"}}]],
    plugins: [
      require.resolve('../../src/babel'),
      'babel-plugin-transform-es2015-modules-commonjs',
    ],
  })

  return result.code
}

describe('babel', () => {
  testFolders.forEach(folderName => {
    const actual = readFileSync(
      join(FIXTURE_PATH, folderName, 'actual.js'),
      'utf8',
    )
    const expected = readFileSync(
      join(FIXTURE_PATH, folderName, 'expected.js'),
      'utf8',
    )

    it(`works with ${folderName}`, () => {
      const result = testPlugin(actual)
      expect(result.trim()).to.be.equal(expected.trim())
    })
  })
})