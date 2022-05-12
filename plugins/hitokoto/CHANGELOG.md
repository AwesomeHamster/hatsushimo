# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.2] - 2022-05-12

### Added

- add `ctx.hitokoto` as a service for other koishi plugins

  - `ctx.hitokoto.getHitokoto(params)` returns a sentence from hitokoto.
  - `ctx.hitokoto.types` returns a list of hitokoto types.

- Better conprehensive descriptions of options.
- Better Japanese and English translations.
- Experimental support for more languages.

## [2.1.1] - 2022-03-26

### Added

- add `hitokoto.types` command that displays all types of hitokoto sentences
- more comprehensive README

### Fixed

- fix typo and layouts

## [2.1.0] - 2022-03-17

### Added

- initial i18n support

### Changed

- remove template customizable options
- use `ctx.http` instead of `axios`

## [2.0.1] - 2022-01-22

### Added

- add tests

## [2.0.0] - 2022-01-17

### Added

- support koishi v4

## [1.0.3] - 2021-12-28

### Added

- show error message when provide wrong options

### Changed

- template messages are customizable

### Fixed

- fix typo in template messages
- fix broken link in comments

## [1.0.2] - 2021-12-28

This patch released with no changes.

## [1.0.1] - 2021-12-28

### Added

- `hitokoto` command
