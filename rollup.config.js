import typescript from 'rollup-plugin-typescript2'
import packageJson from './package.json'
import fs from 'fs'
import path from 'path'
import dtsPlugin from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import { deleteEmptyFoldersRecursive } from './utils/delete-empty-folders-recursive'

const ENTRY = 'src/main.ts'
const OUT_FILE_NAME = 'best-events'
const OUT_DIR = 'dist'

const {
  name: entryBasename,
  dir: entryDirname
} = path.parse(ENTRY)

// MESS WITH package.json

packageJson.name = OUT_FILE_NAME
packageJson.main = `${OUT_DIR}/${OUT_FILE_NAME}.js`
packageJson.module = `${OUT_DIR}/${OUT_FILE_NAME}.js`
packageJson.types = `${OUT_DIR}/${OUT_FILE_NAME}.d.ts`
packageJson.files = [OUT_DIR]
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2))

// CLEAN OUT DIR BEFORE BUILD

fs.rmSync(OUT_DIR, { recursive: true, force: true })

// PLUGNS CONFIG

const typescriptConfig = {
  tsconfigOverride: {
    include: [`${entryDirname}/**/*.ts`, `${entryDirname}/**/*.tsx`]
  }
}

// BASE PLUGINS FOR ALL OUTPUT FORMATS

const plugins = [
  typescript(typescriptConfig)
]

// OUTPUT FORMATS

// esm
const esm = {
  input: ENTRY,
  output: {
    file: `${OUT_DIR}/${OUT_FILE_NAME}.js`,
    format: 'esm',
  },
  plugins
}

// BUNDLE TYPE DEFINITIONS

const cleanup = (dir) => ({
  writeBundle: () => {
    deleteEmptyFoldersRecursive(dir)
  }
})

const dts = {
  input: `${OUT_DIR}/${entryBasename}.d.ts`,
  output: {
    file: `${OUT_DIR}/${OUT_FILE_NAME}.d.ts`,
    format: 'es'
  },
  plugins: [
    dtsPlugin(),
    del({
      targets: `${OUT_DIR}/**/*.d.ts`,
      hook: 'generateBundle'
    }),
    cleanup(OUT_DIR)
  ],
}

export default [
  esm,
  dts
]
