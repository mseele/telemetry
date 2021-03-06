import consola from 'consola'
import inquirer from 'inquirer'
import c from 'chalk'
import { updateUserNuxtRc } from './utils/nuxtrc'
import { TelemetryOptions } from './types'
import { usage, consentVersion } from './meta'

export async function ensureUserConsent (options: TelemetryOptions): Promise<boolean> {
  if (options.consent >= consentVersion) {
    return true
  }

  if (options.consent === false || !process.stdout.isTTY) {
    return false
  }

  consola.info(`${c.green('NuxtJS')} collects completely anonymous data about usage.
  This will help us improving developer experience over the time.
  Read more: ${c.cyan.underline('https://git.io/nuxt-telemetry')}`)

  const manualInstructions = `by setting ${c.cyan('telemetry: true|false')} in ${c.cyan('nuxt.config')} or\n  Using ${c.cyan(usage)} or\n  Setting ${c.cyan('NUXT_TELEMETRY_DISABLED=1')} environment variable`

  const { accept } = await inquirer.prompt({
    type: 'confirm',
    name: 'accept',
    message: 'Are you interested in participation?'
  })
  process.stdout.write('\n')

  if (accept) {
    consola.success(`Thanks for participating!\n  You can always change your mind ${manualInstructions}`)
    updateUserNuxtRc('telemetry.consent', consentVersion)
    return true
  }

  consola.success(`Telemetry disabled for you machine.\n  You can always change your mind ${manualInstructions}`)
  updateUserNuxtRc('telemetry.consent', false)
  return false
}
