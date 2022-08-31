// Copyright 2022 Aris Ripandi <aris@duck.com>
// SPDX-License-Identifier: Apache-2.0

#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]
#![allow(clippy::nonstandard_macro_braces)] // Clippy bug: https://github.com/rust-lang/rust-clippy/issues/7422

#[cfg(target_os = "linux")]
use std::path::PathBuf;

use cocoa::appkit::{NSWindow, NSWindowStyleMask, NSWindowTitleVisibility};
// use tauri::api::dialog::ask;
use tauri::{Manager, Runtime, SystemTray, SystemTrayEvent, Window};
use tauri_plugin_store::PluginBuilder;

mod menu;
mod otp_generator;
mod security;
mod sys_utils;

#[tauri::command]
fn exit_app(handle: tauri::AppHandle) {
  handle.exit(0);
}

fn main() {
  let system_tray = SystemTray::new();

  tauri::Builder::default()
    .plugin(PluginBuilder::default().build())
    .menu(menu::menu())
    .on_menu_event(|event| match event.menu_item_id() {
      "quit" => {
        let _ = event.window().emit("app-event", event.menu_item_id()).unwrap();
      }
      "close" => {
        let _ = event.window().emit("app-event", event.menu_item_id()).unwrap();
      }
      "export" => {
        let _ = event.window().emit("app-event", event.menu_item_id()).unwrap();
      }
      "import" => {
        let _ = event.window().emit("app-event", event.menu_item_id()).unwrap();
      }
      "lock_vault" => {
        let _ = event.window().emit("app-event", event.menu_item_id()).unwrap();
      }
      "new_item" => {
        let _ = event.window().emit("app-event", event.menu_item_id()).unwrap();
      }
      "signout" => {
        let _ = event.window().emit("app-event", event.menu_item_id()).unwrap();
      }
      "sync_vault" => {
        let _ = event.window().emit("app-event", event.menu_item_id()).unwrap();
      }
      "update_check" => {
        let _ = event.window().emit("app-event", event.menu_item_id()).unwrap();
      }
      _ => {}
    })
    .setup(|app| {
      // Initialize updater and check if a new version is available.
      let handle = app.handle();
      tauri::async_runtime::spawn(async move {
        let _response = handle.updater().check().await;
      });

      let window = app.get_window("main").unwrap();
      window.set_transparent_titlebar(true, true);

      // only include this code on debug builds
      #[cfg(debug_assertions)]
      {
        window.open_devtools();
      }

      // Listen New Update Available
      window.listen("tauri://update-available".to_string(), move |msg| {
        println!("New version available: {:?}", msg);
      });

      Ok(())
    })
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::LeftClick { .. } => {
        let main_window = app.get_window("main").unwrap();
        if main_window.is_visible().unwrap() {
          main_window.hide().unwrap();
        } else {
          main_window.show().unwrap();
          main_window.set_focus().unwrap();
        }
      }
      _ => {}
    })
    .invoke_handler(tauri::generate_handler![
      otp_generator::generate_totp,
      sys_utils::get_device_info,
      security::generate_udevice_id,
      security::encrypt_str,
      security::decrypt_str,
      security::create_hash,
      security::verify_hash,
      security::md5_hash,
      exit_app,
    ])
    .build(tauri::generate_context!())
    .expect("error while running tauri application")
    .run(|app_handle, event| match event {
      tauri::RunEvent::ExitRequested { .. } => {
        // api.prevent_exit();
        app_handle.exit(0);
        // TODO: call exit method from the frontend!
        // let window = app_handle.get_window("main").unwrap();
        // ask(Some(&window), "Tauri", "Is Tauri awesome?", |answer| {
        //   if answer {
        //     app_handle.exit(0);
        //   }
        // });
        // window.emit("app-event", "quit").unwrap();
      }
      _ => {}
    })
}

pub trait WindowExt {
  #[cfg(target_os = "macos")]
  fn set_transparent_titlebar(&self, title_transparent: bool, remove_toolbar: bool);
}

impl<R: Runtime> WindowExt for Window<R> {
  #[cfg(target_os = "macos")]
  fn set_transparent_titlebar(&self, title_transparent: bool, remove_tool_bar: bool) {
    unsafe {
      let id = self.ns_window().unwrap() as cocoa::base::id;
      NSWindow::setTitlebarAppearsTransparent_(id, cocoa::base::YES);
      let mut style_mask = id.styleMask();
      style_mask.set(NSWindowStyleMask::NSFullSizeContentViewWindowMask, title_transparent);

      if remove_tool_bar {
        style_mask.remove(
          NSWindowStyleMask::NSClosableWindowMask
            | NSWindowStyleMask::NSMiniaturizableWindowMask
            | NSWindowStyleMask::NSResizableWindowMask,
        );
      }

      id.setStyleMask_(style_mask);

      id.setTitleVisibility_(if title_transparent {
        NSWindowTitleVisibility::NSWindowTitleHidden
      } else {
        NSWindowTitleVisibility::NSWindowTitleVisible
      });

      id.setTitlebarAppearsTransparent_(if title_transparent {
        cocoa::base::YES
      } else {
        cocoa::base::NO
      });
    }
  }
}
