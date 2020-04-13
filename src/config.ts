import { getInput } from '@actions/core'

export interface IActionConfig {
  src: string
  dst: string
  branch: string
  repo: string
  single: boolean
  workspace: string
  name: string
  email: string
}

export function getConfig (): IActionConfig {
  const config = {
    src: getInput('src') || 'dist',
    dst: getInput('dst') || '',
    branch: getInput('branch') || 'master',
    repo: getInput('repo'),
    single: getInput('single') === 'true',
    workspace: process.env.GITHUB_WORKSPACE || '',
    name: getInput('name') || 'Github Actions',
    email: getInput('email') || 'noreply@actions.github.com'
  }
  if (!config.src.endsWith('/')) config.src += '/'
  if (config.dst) config.dst = '/' + config.dst
  return config
}
