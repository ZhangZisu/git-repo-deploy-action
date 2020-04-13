import * as fs from 'fs-extra'
import { execute } from './exec'
import { getConfig } from './config'

export async function main () {
  const config = getConfig()

  const local = '/tmp/git-repo-deploy'
  await fs.ensureDir('/tmp')

  if (await execute(`git clone ${config.repo} -b ${config.branch} --depth 1 ${local}`, '/tmp')) {
    if (await execute(`git clone ${config.repo} --depth 1 ${local}`, '/tmp')) {
      throw new Error('Bad repo')
    }
    await execute(`git checkout --orphan ${config.branch}`, local)
    await execute('git reset --hard', local)
  }

  await execute(`git config user.name "${config.name}"`, local)
  await execute(`git config user.email "${config.email}"`, local)
  await execute('git rm -r -f --ignore-unmatch "*"', local)

  await execute(`rsync -q -av --progress ${config.src} ${local}${config.dst}`, config.workspace)

  if (config.single) {
    await execute(`git checkout --orphan ${config.branch}-temp`, local)
    await execute('git add --all .', local)
    await execute('git commit -m "deploy" --quiet', local)
    await execute(`git branch -M ${config.branch}-temp ${config.branch}`, local)
  } else {
    await execute('git add --all .', local)
    await execute('git commit -m "deploy" --quiet', local)
  }
  await execute(`git push origin ${config.branch} --force`, local)
}
