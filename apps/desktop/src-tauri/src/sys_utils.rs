use sysinfo::{System, SystemExt};
use tauri::command;

#[derive(serde::Serialize)]
pub struct Devices {
  os_platform: String,
  os_version: String,
  host_name: String,
  machine_uuid: String,
}

#[command]
pub(crate) async fn get_device_info() -> Result<Devices, String> {
  // Please note that we use "new_all" to ensure that all list of components,
  // network interfaces, disks and users are already filled!
  let mut sys = System::new_all();

  // First we update all information of our `System` struct.
  sys.refresh_all();

  // System information:
  // let sys_os_platform = sys.name();
  // let sys_os_version = sys.os_version();
  // let sys_host_name = sys.host_name();

  // Display system information:
  println!("System name:             {:?}", sys.name().unwrap());
  println!("System OS version:       {:?}", sys.os_version().unwrap());
  println!("System host name:        {:?}", sys.host_name().unwrap());

  Ok(Devices {
    os_platform: "sys_os_version".into(),
    os_version: "sys_os_version".into(),
    host_name: "sys_host_name".into(),
    machine_uuid: "sys_machine_uuid".into(),
  })
}
