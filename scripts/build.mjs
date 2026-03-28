/* global $ */

import path from 'path'

import fs from 'fs-extra'

await (async () => {
  const { argv } = process
  const target = argv[3]
  const validTargets = ['release-vercel', 'release-ci', 'surge']

  if (!validTargets.includes(target)) {
    throw new Error('Invalid build target.')
  }

  await $`vp run verify-translation`
  await clean()
  console.info('🚧  Build artifact')

  // Treating warnings as errors because process.env.CI = true.
  process.env.CI = 'false'

  switch (target) {
    case 'release-vercel':
      process.env.NODE_ENV = 'production'
      process.env.VITE_USE_SW = 'true'
      await $`vp build`
      await insertSashimiScript()

      break

    case 'release-ci':
      process.env.NODE_ENV = 'production'
      process.env.VITE_HASH_ROUTER = 'true'
      await $`vp build`
      await changeManifest({
        start_url: `${getUrlPathPrefix()}/#/home`,
      })
      await bundleArtifact()

      break

    case 'surge':
      process.env.NODE_ENV = 'production'
      process.env.VITE_HASH_ROUTER = 'true'
      process.env.VITE_RUN_IN_SURGE = 'true'
      process.env.VITE_URL_PATH_PREFIX = '/web'
      await $`vp build`
      await changeManifest({
        short_name: 'Dashboard',
        name: 'Surge Web Dashboard',
        start_url: `${getUrlPathPrefix()}/index.html#/home`,
      })
      await bundleArtifact()
      await $`mv ./build.tar.gz ./yasd.tar.gz`

      break

    default:
      process.env.NODE_ENV = 'production'
      process.env.VITE_USE_SW = 'true'
      await $`vp build`

      if (process.env.VITE_HASH_ROUTER === 'true') {
        await changeManifest({
          start_url: `${getUrlPathPrefix()}/#/home`,
        })
      }
  }
})()

async function changeManifest(obj = {}) {
  const manifest = await fs.readJson('build/manifest.json')

  await fs.writeJSON(
    'build/manifest.json',
    {
      ...manifest,
      ...obj,
    },
    { spaces: 2 },
  )
}

async function insertSashimiScript() {
  const script = `<script async src="https://sashimi.royli.dev/sashimi.js" data-website-id="486582f7-125c-41db-8bf0-5409c8479286"></script>`
  const indexHTMLPath = path.join(__dirname, '../build/index.html')

  const indexHTML = await fs.readFile(indexHTMLPath, 'utf-8')
  const newHTML = indexHTML.replace('</head>', `${script}</head>`)
  await fs.writeFile(indexHTMLPath, newHTML)
}

async function bundleArtifact() {
  await $`(cd ./build; tar -czf ../build.tar.gz ./)`
}

async function clean() {
  console.info('🧹  Clean up')
  await $`rimraf ./build`
  await $`rimraf ./*.tar.gz`
}

function getUrlPathPrefix() {
  return 'VITE_URL_PATH_PREFIX' in process.env
    ? process.env.VITE_URL_PATH_PREFIX
    : ''
}
