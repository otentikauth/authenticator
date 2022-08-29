import { invoke } from '@tauri-apps/api/tauri'
import { localData } from './storage'

type GenerateTOTPTypes = {
  secret: string
  digits: number
  period: number
  algorithm: 'SHA1' | 'SHA256'
}

/**
 * Function to check if a character is alpha-numeric.
 *
 * @param {string} c
 * @return {boolean}
 */
export function isAlphaNumeric(str: string): boolean {
  /* Iterating character by character to get ASCII code for each character */
  for (let i = 0, len = str.length, code = 0; i < len; ++i) {
    /* Collecting charCode from i index value in a string */
    code = str.charCodeAt(i)

    /* Validating charCode falls into anyone category */
    if (
      (code > 47 && code < 58) || // numeric (0-9)
      (code > 64 && code < 91) || // upper alpha (A-Z)
      (code > 96 && code < 123) // lower alpha (a-z)
    ) {
      continue
    }

    /* If nothing satisfies then returning false */
    return false
  }

  /* After validating all the characters and we returning success message*/
  return true
}

export const encryptStr = async (plainStr: string): Promise<any> => {
  const passphrase = await localData.get('passphrase')
  return invoke('encrypt_str', { plainStr, passphrase })
}

export const decryptStr = async (encryptedStr: string): Promise<any> => {
  const passphrase = await localData.get('passphrase')
  return invoke('decrypt_str', { encryptedStr, passphrase })
}

export const md5Hash = async (str: string): Promise<any> => {
  return invoke('md5_hash', { str })
}
export const createHash = async (plaintext: string): Promise<any> => {
  return invoke('create_hash', { plaintext })
}

export const verifyHash = async (plaintext: string, hashedStr: string): Promise<any> => {
  return invoke('verify_hash', { plaintext, hashedStr })
}

// Generate TOTP token from secret using Rust.
// https://tauri.app/v1/guides/features/command/
export const generateTOTP = async ({ secret, period, digits, algorithm }: GenerateTOTPTypes): Promise<any> => {
  return invoke('generate_totp', { secret, period, digits, algorithm })
}
