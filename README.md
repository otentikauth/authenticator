<p align="center"><img src="./banner.svg" width="500" height="150" alt="Project Logo"></p>
<p align="center">
    <a href="https://github.com/riipandi/otentik-authenticator-desktop/pulse">
        <img src="https://img.shields.io/badge/Contributions-welcome-blue.svg?style=flat-square" alt="Contribution welcome">
    </a>
    <a href="https://twitter.com/riipandi">
        <img src="https://img.shields.io/badge/follow-twitter-1d9bf0.svg?style=flat-square" alt="Twitter Badge">
    </a>
    <a href="https://github.com/sponsors/riipandi">
        <img src="https://img.shields.io/static/v1?color=26B643&label=Sponsor&message=%E2%9D%A4&logo=GitHub&style=flat-square" alt="Sponsors">
    </a>
</p>

## Introduction

This repository houses all Otentik client applications except the [web vault](https://vault.otentik.app).

<!-- Please refer to the Clients section of the Contributing Documentation for build instructions, recommended tooling, code style tips,
and lots of other great information to get you started. -->

---

Otentik Authenticator is a secure, Open Source, and Google Authenticator compatible application to manage your 2-step verification (2FA)
tokens for your online services. Otentik Authentocator is lightweight and support time-based (TOTP) & counter-based (HOTP) token.

Watch the [demo video](https://youtu.be/5hPbu7xgFl4) to see how it works.

## Getting Started

Is this application finished yet? Yes and no. The main functions (OTP code generator and synchronization) are completed.
I want this app to be available in multi-platform and on mobile devices.

You can download the binary at the [release page](https://github.com/riipandi/otentik-authenticator-desktop/releases).
Currently only supports macOS with Intel chipset. Windows, Linux, and mobile versions are included in the roadmap.

## Migrating

The following migration guides walk you through the process of migrating from your existing OTP app to Otentik Authenticator.

-   Migrating from Google Authenticator to Otentik Authenticator (_todo_)
-   Migrating from Authy to Otentik Authenticator (_todo_)
-   Migrating from Raivo OTP to Otentik Authenticator (_todo_)

## How was this built?

Originally this app was created during the [Supabase Launch Week 5 Hackathon](https://supabase.com/blog/launch-week-5-hackathon) and winner for
_[Most Technically Impressive](https://supabase.com/blog/launch-week-5-hackathon-winners#most-technically-impressive)_ category. The idea is based
on my personal problem, everytime I want to log in to a website I have to reach for my phone just to get the OTP code. So I thought that having an
application to manage OTP code that could sync to the desktop would be helpful.

This app uses [Supabase](https://supabase.com/) for storing the collections and authenticating the user. Users can signup and log in using their
email addresses. I have no plan for using social authentication. The sensitive data such as 2FA secret and backup code
are encrypted with [AES256 encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) before storing at
Supabase.

### The complete tech stack:

-   [Supabase](https://supabase.com/): auth and database.
-   [Tauri](https://tauri.app/): for the desktop app.
-   [Rust](https://www.rust-lang.org/): Tauri is using Rust.
-   [TypeScript](https://www.typescriptlang.org/): for type checking.
-   [React](https://reactjs.org/): for the UI frontend library.
-   [Vite](https://vitejs.dev/): for the frontend tooling.
-   [Tailwind CSS](https://tailwindcss.com/): for the styling.
-   [Headless UI](https://headlessui.com/): create interactive UI.

### Why Tauri?

The simple answer is: the binary file size is smaller rather than Electron.

## Quick Start

### Prerequisites

At least you will need `Nodejs >=16` and `Rust >= 1.63` to develop this project, and your favorite IDE or code editor.
Use [rustup](https://rustup.rs/) to install Rust on your machine. Also, if you want to run Supabase instance at your
local machine, you will need `Docker >= 20.10` and [Supabase CLI](https://github.com/supabase/cli).

### Up and Running

Create `.env` file (you can copy from `.env.example`) then fill the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values with yours.

For detailed explanation on how things work, check out [Supabase documentation](https://supabase.com/docs) and
[Tauri documentation](https://tauri.app/v1/guides/) page.

### Signing updates

```sh
# Generate signing key
mkdir -p $(pwd)/.tauri
npx tauri signer generate -w .tauri/otentik_r11.key

# Build signed release
TAURI_PRIVATE_KEY=$(cat .tauri/otentik_r11.key) pnpm exec nx build:mac:x64 desktop
```

> ATTENTION: If you lose your private key OR password, you'll not be able to sign your update package and updates will not works.

Read more at: <https://tauri.app/v1/guides/distribution/updater/#signing-updates>

## Roadmaps

-   [ ] Account management
-   [ ] Export & import collections
-   [ ] Offline synchronization
-   [ ] Create mobile version
-   [ ] Create Windows version
-   [ ] Create Linux version

## Security Issues

If you discover any security-related issues, view our [vulnerability policy](https://github.com/riipandi/otentik-authenticator/security/policy)
and kindly email us at [aris@duck.com](mailto:aris@duck.com) instead of using the issue tracker.

## Contributing

Thank you for considering contributing to this project! If you wish to help, you can learn more about how you can contribute to this project
starting by sending me a direct message on [Twitter](https://s.id/dmaris).

## Thanks to...

In general, I'd like to thank every single one who open-sources their source code for their effort to contribute
something to the open-source community. Your work means the world! 🌍 ❤️

## Maintainers

Currently, Aris Ripandi ([@riipandi](https://twitter.com/riipandi)) is the only maintainer.

## License

Otentik Authenticator is variously licensed under a number of different licenses.

The source code Otentik Authenticator for macOS, iOS, Android, and browser extensions are available to everyone
under the terms of [Apache License 2.0][choosealicense]. A copy of each license can be found in each project
[packages](./apps/) and [libraries](./libs/).

The binary distributions of Otentik Authenticator and the [Otentik managed service](https://vault.otentik.app)
are copyrighted.

For more information, see the [licensing information](./LICENSE.md).

[choosealicense]: https://choosealicense.com/licenses/apache-2.0/
