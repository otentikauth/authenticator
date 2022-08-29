import { message } from '@tauri-apps/api/dialog'
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'
import { parseCollections } from './array-helpers'

import { encryptStr } from './string-helpers'
import { sbClient } from './supabase'

export async function importCollections(filePath: string) {
  const userId = sbClient.auth.session()?.user?.id
  const fileCOntent = await readTextFile(filePath, { dir: BaseDirectory.App })
  const rawData = JSON.parse(fileCOntent)

  if (!rawData.version) {
    return await message('Invalid backup file!', 'Warning')
  }

  if (!rawData.collections || rawData.collections.length < 1) {
    return await message('Collections empty, nothing to import!', 'Warning')
  }

  const jsonData = await rawData.collections.map(async (item: any) => {
    // Encrypt sensitive data with user's master key
    const issuer = await encryptStr(item.issuer)
    const user_identity = await encryptStr(item.account)
    const secret = await encryptStr(item.secret)

    return {
      issuer,
      user_identity,
      secret,
      user_id: userId,
      algorithm: item.algorithm,
      kind: item.kind,
      period: item.timer,
      digits: item.digits,
      icon_path: item.iconPath,
    }
  })

  const submission = await Promise.all(jsonData)
  const { error, status } = await sbClient.from('vaults').insert(submission)

  if (error && status === 409) {
    return await message('Some items are not imported because they already exist!', 'Warning')
  }

  return await message('Collections has been imported!', 'Success')
}

export async function exportCollections(filePath: string) {
  const userId = sbClient.auth.session()?.user?.id
  const time = new Date().toISOString()

  const { data } = await sbClient.from('vaults').select().match({ user_id: userId })
  const rawData = await parseCollections(data || [])
  const collections = rawData.map((item: any) => ({
    issuer: item.issuer,
    account: item.user_identity,
    secret: item.secret,
    iconPath: item.icon_path,
    kind: item.kind,
    algorithm: item.algorithm,
    digits: item.digits,
    timer: item.period,
  }))

  const jsonData = { version: 1, createdAt: time, collections }
  const exportData = JSON.stringify(jsonData)

  await writeTextFile(filePath, exportData, { dir: BaseDirectory.App })

  return await message('Collections exported!', 'Success')
}
