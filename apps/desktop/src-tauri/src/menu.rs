// Copyright 2022 Aris Ripandi <aris@duck.com>
// SPDX-License-Identifier: Apache-2.0

use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu};

// macOS only
pub(crate) fn menu() -> Menu {
  // ---------------------------------------------------------------------------------------------
  // App Menu (macOS)
  // ---------------------------------------------------------------------------------------------
  let about_menu = AboutMetadata::new()
    .version(String::from("0.4.1"))
    .authors(vec![String::from("Aris Ripandi")])
    .comments(String::from("Open Source two factor authenticator"))
    .copyright(String::from("Apache-2.0 License"))
    .license(String::from("Apache-2.0 License"))
    .website(String::from("https://otentik.app/authenticator"))
    .website_label(String::from("Homepage"));

  let m_app_check_update = CustomMenuItem::new("update-check", "Check for Updates");
  // let m_app_preferences = CustomMenuItem::new("preferences", "Preferences");
  let m_app_lock_vault = CustomMenuItem::new("lock-vault", "Lock Vault");
  let m_app_signout = CustomMenuItem::new("signout", "Sign out");

  let m_app = Submenu::new(
    "Authenticator",
    Menu::new()
      .add_native_item(MenuItem::About("Authenticator".to_string(), about_menu))
      .add_native_item(MenuItem::Separator)
      .add_item(m_app_check_update)
      // .add_item(m_app_preferences.accelerator("CmdOrControl+,"))
      .add_native_item(MenuItem::Separator)
      .add_item(m_app_lock_vault.accelerator("CmdOrControl+L"))
      .add_native_item(MenuItem::Separator)
      .add_item(m_app_signout)
      .add_native_item(MenuItem::Quit),
  );

  // ---------------------------------------------------------------------------------------------
  // File Menu
  // ---------------------------------------------------------------------------------------------
  let m_file_new = CustomMenuItem::new("new-item", "New Item").accelerator("CmdOrControl+N");
  let m_file_import = CustomMenuItem::new("import", "Import Data").accelerator("CmdOrControl+I");
  let m_file_export = CustomMenuItem::new("export", "Export Data").accelerator("CmdOrControl+E");
  let m_file_sync = CustomMenuItem::new("sync-vault", "Sync Vault").accelerator("CmdOrControl+R");

  let file_menu = Submenu::new(
    "File",
    Menu::new()
      .add_item(m_file_new)
      .add_native_item(MenuItem::Separator)
      .add_item(m_file_import)
      .add_item(m_file_export)
      .add_native_item(MenuItem::Separator)
      .add_item(m_file_sync),
  );

  // ---------------------------------------------------------------------------------------------
  // Edit Menu
  // ---------------------------------------------------------------------------------------------
  let edit_menu = Submenu::new(
    "Edit",
    Menu::new()
      .add_native_item(MenuItem::Undo)
      .add_native_item(MenuItem::Redo)
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Cut)
      .add_native_item(MenuItem::Copy)
      .add_native_item(MenuItem::Paste)
      .add_native_item(MenuItem::SelectAll),
  );

  // ---------------------------------------------------------------------------------------------
  // Finally, register the menus
  // ---------------------------------------------------------------------------------------------
  Menu::new()
    .add_submenu(m_app)
    .add_submenu(file_menu)
    .add_submenu(edit_menu)
}
