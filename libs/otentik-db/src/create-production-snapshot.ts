createProductionSnapshot()

async function createProductionSnapshot() {
  // eslint-disable-next-line
  const { execSync } = require('child_process')

  console.log('========== Create Snapshot ==========')

  const now = new Date()
  const inquirer = await import('inquirer')
  const { name } =
    // @eslint-disable-next-line
    (await (inquirer as any).default.prompt({
      message: 'enter a name for the snapshot',
      name: 'name',
    })) || now.toISOString()

  execSync(
    `PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h $POSTGRES_HOST -p 5432 -U postgres -a --inserts -f libs/otentik-db/supabase/snapshots/prod-${name}.sql -t public.profiles -t public.vaults`
  )
}
