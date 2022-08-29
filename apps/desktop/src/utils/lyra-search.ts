import { create, insert, remove, search } from '@lyrasearch/lyra'
export { create, insert, remove, search }

export const db = create({
  schema: {
    collection_id: 'string',
    algorithm: 'string',
    // backup_code: 'string',
    // icon_path: 'string',
    digits: 'number',
    issuer: 'string',
    kind: 'string',
    period: 'number',
    secret: 'string',
    token: 'string',
    user_identity: 'string',
  },
})
