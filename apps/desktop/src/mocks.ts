import { faker } from '@faker-js/faker'
import { sortObjectsByProp, groupArrayObjectByAlphabet } from './utils/array-helpers'
import { generateTOTP } from './utils/string-helpers'

const generateMock = async (count: number): Promise<any> => {
  const result = []

  for (let i = 0; i < count; i++) {
    const id = faker.datatype.uuid()
    const issuer = faker.internet.domainName()
    const user_identity = faker.internet.email().toLowerCase()
    const secret = faker.random.alphaNumeric(40)
    const algorithm = 'SHA1'
    const kind = 'TOTP'
    const period = 30
    const digits = 6

    // Create a new TOTP object.
    const token = await generateTOTP({ secret, period, digits, algorithm })

    result.push({
      id,
      issuer,
      user_identity,
      token,
      secret,
      algorithm,
      kind,
      period,
      digits,
    })
  }

  return result
}

// Unsorted mock data.
export const randomData = await generateMock(100)

// Sort array with the custom function that sorts alphabetically by the name key
export const sortedData = sortObjectsByProp(randomData, 'issuer')

// Group array by the alphabetical key of the name key
export const collectionGrouped = groupArrayObjectByAlphabet(sortedData)
// export const collectionGrouped = {}
