/* global $ */

;(async () => {
  await $`vp dlx shadcn add ${process.argv[3]}`
  await $`vp lint ./src/components/ui --fix`
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
