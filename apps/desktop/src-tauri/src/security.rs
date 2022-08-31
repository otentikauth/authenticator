extern crate bcrypt;
extern crate machine_uid;

use tauri::command;

use bcrypt::{hash, verify, DEFAULT_COST};
use magic_crypt::{new_magic_crypt, MagicCryptTrait};
use md5::{Digest, Md5};

#[command]
pub(crate) async fn encrypt_str(plain_str: String, passphrase: String) -> String {
  let mc = new_magic_crypt!(passphrase, 256);
  let encrypted = mc.encrypt_str_to_base64(plain_str);
  encrypted.into()
}

#[command]
pub(crate) async fn decrypt_str(encrypted_str: String, passphrase: String) -> String {
  let mc = new_magic_crypt!(passphrase, 256);
  let decrypted = mc.decrypt_base64_to_string(&encrypted_str).unwrap();
  decrypted.into()
}

#[command]
pub(crate) async fn create_hash(plaintext: String) -> String {
  let hashed = hash(plaintext, DEFAULT_COST).unwrap();
  hashed.into()
}

#[command]
pub(crate) async fn verify_hash(plaintext: String, hashed_str: String) -> bool {
  let valid = verify(plaintext, &hashed_str).unwrap();
  valid.into()
}

#[command]
pub(crate) async fn md5_hash(str: String) -> String {
  let mut hasher = Md5::new();
  hasher.update(&str);

  let encoded = hasher.finalize();
  let result = format!("{:x}", encoded);
  // println!("MD5-encoded hash: {:?}", result);

  result.into()
}

#[command]
pub(crate) async fn generate_udevice_id(uid: String) -> String {
  let device_uuid: String = machine_uid::get().unwrap();

  // Get trimmed device_uuid
  let a_trimmed = device_uuid.replace("-", "");
  let a_slice = &a_trimmed[..12];
  let _a = a_slice.to_string();

  // Get trimmed external uuid
  let b_trimmed = uid.replace("-", "");
  let b_slice = &b_trimmed[..12];
  let _b = b_slice.to_string();

  let new_id = _a + &_b;
  let result = new_id.to_uppercase();

  result.into()
}
