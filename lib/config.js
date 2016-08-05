const path = require('path')
const convict = require('convict')

convict.addFormat({
  name: 'placeholder',
  validate: (val) => { },
  coerce: (val, config) =>
    val.replace(/\$\{([\w\.]+)}/g, (v, m) => config.get(m))
})

const config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  debug: {
    doc: 'debug mode',
    format: 'Boolean',
    default: false,
    env: 'DEBUG'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8234,
    env: 'PORT'
  },
  host: {
    doc: 'development host address',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'HOST',
    arg: 'host'
  },
  distPath: {
    doc: 'development distribution path',
    format: '*',
    default: 'dist'
  },
  distGlob: {
    doc: 'dist file glob',
    format: 'placeholder',
    default: '${distPath}/**/*'
  },
  buildPath: {
    doc: 'release build path',
    format: '*',
    default: './build'
  },
  buildGlob: {
    doc: 'release build path',
    format: 'placeholder',
    default: '${buildPath}/**/*'
  },

  templatePath: {
    doc: 'template src path',
    format: '*',
    default: './templates'
  },
  templateGlob: {
    doc: 'template glob pattern',
    format: 'placeholder',
    default: '${templatePath}/**/[^_]*.pug'
  },
  templateWatchGlob: {
    doc: 'template glob pattern',
    format: 'placeholder',
    default: '${templatePath}/**/[^_]*.(pug|md)'
  },
  templateDistPath: {
    doc: 'template dist path',
    format: 'placeholder',
    default: '${distPath}'
  },
  templateBuildGlob: {
    doc: 'template build glob',
    format: 'placeholder',
    default: '${buildPath}/**/*.html'
  },
  templateBuildPath: {
    doc: 'template build path',
    format: 'placeholder',
    default: '${buildPath}'
  }
})

module.exports = config
