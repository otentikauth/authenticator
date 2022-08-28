restoreSnapshotToLocalDb()

async function restoreSnapshotToLocalDb() {
  // eslint-disable-next-line
  const { execSync } = require('child_process')
  // eslint-disable-next-line
  const { readdirSync } = require('fs')
  const inquirer = await import('inquirer')
  // eslint-disable-next-line
  const path = require('path')

  console.log('======== Restore Snapshot =========')
  const snapshotsPath = path.join(__dirname, '../supabase/snapshots')
  const snapshots = readdirSync(snapshotsPath)

  // @eslint-disable-next-line
  const { snapshot } = await (inquirer as any).default.prompt({
    type: 'list',
    choices: snapshots,
    message: 'select a snapshot to restore',
    name: 'snapshot',
  })
  console.log(snapshot)

  console.log('clearing current data')
  execSync('PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 54322 -f libs/otentik-db/supabase/clear-db.sql')
  console.log(`Restoring snapshot ${snapshot}...`)
  execSync(
    `PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 54322 -f libs/otentik-db/supabase/snapshots/${snapshot}`
  )
}
