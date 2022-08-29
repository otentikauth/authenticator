use libreauth::{hash::HashFunction, oath::TOTPBuilder};

#[tauri::command]
pub(crate) async fn generate_totp(
    secret: String,
    period: u32,
    digits: usize,
    algorithm: String,
) -> String {
    let hash_function = match algorithm.to_uppercase().as_str() {
        "SHA1" => HashFunction::Sha1,
        "SHA256" => HashFunction::Sha256,
        "SH512" => HashFunction::Sha512,
        // Set default to SHA1
        _ => HashFunction::Sha1,
    };

    let totp = TOTPBuilder::new()
        .base32_key(&secret)
        .period(period)
        .output_len(digits)
        .hash_function(hash_function)
        .finalize()
        .unwrap();

    let token = totp.generate();

    // println!("{}", token);
    token.into()
}
