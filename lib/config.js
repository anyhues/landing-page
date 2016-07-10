const convict = require('convict')

convict.addFormat({
  name: 'placeholder',
  validate: (val) => { },
  coerce: (val, config) =>
    val.replace(/\$\{([\w\.]+)}/g, (v, m) => config.get(m))
})

module.exports = convict({
  port: {
    doc: 'development server port',
    format: 'port',
    default: '8234',
    env: 'PORT',
    arg: 'port'
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
    default: 'dist/'
  },
  buildPath: {
    doc: 'release build path',
    format: '*',
    default: './build'
  },
  stylePath: {
    doc: 'style src path',
    format: '*',
    default: './styles'
  },
  styleGlob: {
    doc: 'style glob pattern',
    format: 'placeholder',
    default: '${stylePath}/**/[^_]*.pug'
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
  }
})
