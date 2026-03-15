/* global $ */

;(async () => {
  await $`vp dlx shadcn@latest add ${process.argv[3]}`
  await $`vp lint ./src/components/ui --fix`
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
