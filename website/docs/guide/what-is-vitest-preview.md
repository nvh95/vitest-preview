# What is Vitest Preview

Vitest Preview is [Jest Preview](https://github.com/nvh95/jest-preview)'s little brother. Vitest Preview is built on top of Vite and has first-class support for Vitest and is blazing fast!

## Why Vitest Preview?

When writing tests, we usually have to debug by reading the cryptic HTML output on the terminal. Sometimes, they are too complicated to visualize the UI in our heads.

`vitest-preview` previews your Vitest tests right in a browser, then you can see your actual UI visually. You can write tests and watch rendered output changes accordingly. Vitest Preview lets you concentrate on tests in the "real world" rather than deciphering HTML code.

## What is the difference between Vitest Preview and Jest Preview?

Vitest Preview is built to have better support for Vitest. In addition, Vitest Preview is built on top of Vite, which is similar to Vitest. Vitest Preview hands over the hardest part to Vite, which is processing CSS and assets. In terms of functionalities, they are almost identical. In terms of code complexity, Vitest Preview is much simpler than Jest Preview.
