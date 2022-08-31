extern crate machine_uid;

use sysinfo::{System, SystemExt};
use tauri::command;

#[derive(serde::Serialize)]
pub struct DeviceInfo {
  device_uuid: String,
  os_platform: String,
  os_version: String,
  host_name: String,
}

#[command]
pub(crate) async fn get_device_info() -> Result<DeviceInfo, String> {
  // Initiate `sysinfo` instance. We use "new_all" to ensure that
  // all list of components already filled.
  let mut sys = System::new_all();

  // Update all information of our `System` struct.
  sys.refresh_all();

  // System information:
  let sys_device_uuid: String = machine_uid::get().unwrap();
  let sys_os_platform: String = sys.name().unwrap().to_string();
  let sys_os_version: String = sys.os_version().unwrap().to_string();
  let sys_host_name: String = sys.host_name().unwrap().to_string();

  // Display system information:
  // println!("System name         : {:?}", sys_os_platform);
  // println!("System OS version   : {:?}", sys_os_version);
  // println!("System host name    : {:?}", sys_host_name);
  // println!("System machine id   : {:?}", sys_device_uuid);

  Ok(DeviceInfo {
    device_uuid: sys_device_uuid.into(),
    os_platform: sys_os_platform.into(),
    os_version: sys_os_version.into(),
    host_name: sys_host_name.into(),
  })
}
