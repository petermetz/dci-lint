# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.6.3](https://github.com/petermetz/dci-lint/compare/v0.6.2...v0.6.3) (2022-12-21)

**Note:** Version bump only for package @dci-lint/monorepo





## [0.6.2](https://github.com/petermetz/dci-lint/compare/v0.5.1...v0.6.2) (2022-12-21)


### Bug Fixes

* **cockpit:** address CVE-2021-3803 by upgrading @ionic/angular-toolkit ([a56b657](https://github.com/petermetz/dci-lint/commit/a56b657d189d8cb41bdac644525b5805204c1832))
* **cockpit:** upgrade to angular v15 due to vulnerabilities ([ed45312](https://github.com/petermetz/dci-lint/commit/ed45312757c4d268f7fdfb0e316f74291c132cfa))
* **core:** git repo linter now does fetch instead of pull ([19f5d65](https://github.com/petermetz/dci-lint/commit/19f5d653ee3190d15b8d5d0f1b248c993bc9e35f))
* **core:** lint git repo service now does git pull --all ([e4f2c09](https://github.com/petermetz/dci-lint/commit/e4f2c09df6f5ce5475f03e8972c05035cdf13d5c))
* **deps:** address CVE-2022-24999 by ensuring qs is >v6.7.3 ([9dcf341](https://github.com/petermetz/dci-lint/commit/9dcf3413186b465f4eb2f91f4709725ced9f3e64))
* **test-api-client:** attempt [#2](https://github.com/petermetz/dci-lint/issues/2) on IPv6 NodeJS v18 problems ([f2abf8e](https://github.com/petermetz/dci-lint/commit/f2abf8ed8f3730516d064cea6dd80783603caaa2))
* **test-cmd-api-server:** ensure test specifies IPv4 (NodeJS v18) ([1c508d5](https://github.com/petermetz/dci-lint/commit/1c508d5004a8d62a488c37dd83be4152b9afdcd1))
* **tools:** generate-api-server-config migrated to ES modules ([26f8e14](https://github.com/petermetz/dci-lint/commit/26f8e14c8c63cf17e034483094fcd06de2394b04))





## [0.6.1](https://github.com/petermetz/dci-lint/compare/v0.6.0...v0.6.1) (2021-09-16)


### Bug Fixes

* **core:** git repo linter now does fetch instead of pull ([d4d8fc2](https://github.com/petermetz/dci-lint/commit/d4d8fc29bcf9cc2a18f76d75e8cfdfd317998b2d))





# [0.6.0](https://github.com/petermetz/dci-lint/compare/v0.5.1...v0.6.0) (2021-09-15)


### Bug Fixes

* **core:** lint git repo service now does git pull --all ([a803ae6](https://github.com/petermetz/dci-lint/commit/a803ae6008a14dee4d7c7dde534531401bcc6e01))





## [0.5.1](https://github.com/petermetz/dci-lint/compare/v0.5.0...v0.5.1) (2021-09-15)


### Features

* **cli:** added log level arg ([58e7bfe](https://github.com/petermetz/dci-lint/commit/58e7bfee5a51c5b3ac86312d4addbfe758cc0b7a))





# [0.5.0](https://github.com/petermetz/dci-lint/compare/v0.4.0...v0.5.0) (2021-09-15)


### Bug Fixes

* **api-server:** remove redundant generated files ([0ece773](https://github.com/petermetz/dci-lint/commit/0ece7733f1d7a4d3f43e02eb0d9197450ce0cf85))
* **linter:** ignore the .yarn folder which has dependencies in it ([ca3509a](https://github.com/petermetz/dci-lint/commit/ca3509ad91225dc5c2bcf676ff839bdce84204ad))
* stop using deprecated --frozen-lockfile yarn argument ([efe3fc3](https://github.com/petermetz/dci-lint/commit/efe3fc34e05dc827b86ad71dc9739be9033bcfdf))
* **yarn-lock:** updated the lock file ([843aa13](https://github.com/petermetz/dci-lint/commit/843aa13b452532511655fe474c41f8af2392d625))


### Features

* **cmd-api-server:** git checkout args now configurable via request ([58f67ae](https://github.com/petermetz/dci-lint/commit/58f67aecd011a116f39150c526bf446ee6fc12c9))





# [0.4.0](https://github.com/petermetz/dci-lint/compare/v0.3.0...v0.4.0) (2021-09-10)


### Bug Fixes

* github action container image ([f2635fc](https://github.com/petermetz/dci-lint/commit/f2635fc8fd14c44230df09d66b9078d28c656fcb))
* yarn lock file for the build ([608f1d1](https://github.com/petermetz/dci-lint/commit/608f1d1760c79390c21e18f422ca8d6b7178b4bb))





# 0.3.0 (2021-09-07)


### Bug Fixes

* build, default include pattern globstar ([b065ae0](https://github.com/petermetz/dci-lint/commit/b065ae00117f5da1714a23eaeede16fc07cdb077))
* **cmd-api-server:** command line interface arg parsing ([9e404f0](https://github.com/petermetz/dci-lint/commit/9e404f0158a7672c30a45ac40e12a7150f873f89))
* **cockpit:** aria accessibility ([828b2a4](https://github.com/petermetz/dci-lint/commit/828b2a42b5585522b9758b331bf85a2b55838c19))
* **core-api:** open API spec - remove $ref keyword siblings ([e49e7a6](https://github.com/petermetz/dci-lint/commit/e49e7a61a2cfff07b6dd89b9b00c1c2932ae14c4))
* **core:** dependencies that were declared as dev but were not ([8990ae3](https://github.com/petermetz/dci-lint/commit/8990ae3ffcdda10605f25c18ccec958d0812f253))
* **core:** typo in lint-git-repo-service logs ([2768606](https://github.com/petermetz/dci-lint/commit/27686060b5c204a37cbb9e4f1193791583627342))
* dci-lint warnings (inception) ([c93a16f](https://github.com/petermetz/dci-lint/commit/c93a16f79111fd9a6a6a54ce2d075e51ac48d905))
* **deps:** security advisory CVE-2020-28168 ([15db666](https://github.com/petermetz/dci-lint/commit/15db666bb27a8789c6aca583d7ce021cad5b7f70))
* **deps:** specify webpack version of official release ([60d900b](https://github.com/petermetz/dci-lint/commit/60d900b59385fc66792602e1fbcb1b8e16440582))
* **docker:** healthcheck ([1da28f9](https://github.com/petermetz/dci-lint/commit/1da28f97418cd4474f2b35a130de2bf08f69777d))
* **heroku:** insists on PORT as an env var ([93be952](https://github.com/petermetz/dci-lint/commit/93be95279be6b97c198f8f5761469c937bfa1a7b))


### Features

* **cmd-api-server:** add command line interface ([a3d68f5](https://github.com/petermetz/dci-lint/commit/a3d68f5b5a55b1a6a01b63927f02893c07babfba))
* **cmd-api-server:** lint git repo endpoint operational ([20e1f04](https://github.com/petermetz/dci-lint/commit/20e1f04e3dfaa45cdca94d5f7a3e977fc3077570))
* **cmd-api-server:** uses the lint git repo endpoint ([a0b9bd3](https://github.com/petermetz/dci-lint/commit/a0b9bd3a6bfebd7bac8705a84a75d0d279f2acac))
* **cockpit:** add interactive user interface ([87c425d](https://github.com/petermetz/dci-lint/commit/87c425d921b65027033ad07dd5147eaa084486cd))
* **cockpit:** git repo linting page placeholders ([e383544](https://github.com/petermetz/dci-lint/commit/e38354468821c02f5653d48581e4adcb33a855dd))
* **cockpit:** loading indicator for git repo lint page ([306e0ce](https://github.com/petermetz/dci-lint/commit/306e0ce3446b1476e73f3a6012af7d9e79d3ef52))
* **core:** lint-git-repo service supports .dcilintignore file ([92dc2e0](https://github.com/petermetz/dci-lint/commit/92dc2e041114a1d3790e02e432585953a3aa0ae3))
* **core:** lint-git-repo svc config URL support ([3a56d72](https://github.com/petermetz/dci-lint/commit/3a56d72f36e69df20d61f9c7668e9521f00349dc))
* **core:** lint-git-repo-service ([751c6cc](https://github.com/petermetz/dci-lint/commit/751c6cca0c6c2783bbd87d72246e4be5d9784fa7))





# 0.2.0 (2021-09-07)


### Bug Fixes

* build, default include pattern globstar ([b065ae0](https://github.com/petermetz/dci-lint/commit/b065ae00117f5da1714a23eaeede16fc07cdb077))
* **cmd-api-server:** command line interface arg parsing ([9e404f0](https://github.com/petermetz/dci-lint/commit/9e404f0158a7672c30a45ac40e12a7150f873f89))
* **cockpit:** aria accessibility ([828b2a4](https://github.com/petermetz/dci-lint/commit/828b2a42b5585522b9758b331bf85a2b55838c19))
* **core-api:** open API spec - remove $ref keyword siblings ([e49e7a6](https://github.com/petermetz/dci-lint/commit/e49e7a61a2cfff07b6dd89b9b00c1c2932ae14c4))
* **core:** dependencies that were declared as dev but were not ([8990ae3](https://github.com/petermetz/dci-lint/commit/8990ae3ffcdda10605f25c18ccec958d0812f253))
* **core:** typo in lint-git-repo-service logs ([2768606](https://github.com/petermetz/dci-lint/commit/27686060b5c204a37cbb9e4f1193791583627342))
* dci-lint warnings (inception) ([c93a16f](https://github.com/petermetz/dci-lint/commit/c93a16f79111fd9a6a6a54ce2d075e51ac48d905))
* **deps:** security advisory CVE-2020-28168 ([15db666](https://github.com/petermetz/dci-lint/commit/15db666bb27a8789c6aca583d7ce021cad5b7f70))
* **deps:** specify webpack version of official release ([60d900b](https://github.com/petermetz/dci-lint/commit/60d900b59385fc66792602e1fbcb1b8e16440582))
* **docker:** healthcheck ([1da28f9](https://github.com/petermetz/dci-lint/commit/1da28f97418cd4474f2b35a130de2bf08f69777d))
* **heroku:** insists on PORT as an env var ([93be952](https://github.com/petermetz/dci-lint/commit/93be95279be6b97c198f8f5761469c937bfa1a7b))


### Features

* **cmd-api-server:** add command line interface ([a3d68f5](https://github.com/petermetz/dci-lint/commit/a3d68f5b5a55b1a6a01b63927f02893c07babfba))
* **cmd-api-server:** lint git repo endpoint operational ([20e1f04](https://github.com/petermetz/dci-lint/commit/20e1f04e3dfaa45cdca94d5f7a3e977fc3077570))
* **cmd-api-server:** uses the lint git repo endpoint ([a0b9bd3](https://github.com/petermetz/dci-lint/commit/a0b9bd3a6bfebd7bac8705a84a75d0d279f2acac))
* **cockpit:** add interactive user interface ([87c425d](https://github.com/petermetz/dci-lint/commit/87c425d921b65027033ad07dd5147eaa084486cd))
* **cockpit:** git repo linting page placeholders ([e383544](https://github.com/petermetz/dci-lint/commit/e38354468821c02f5653d48581e4adcb33a855dd))
* **cockpit:** loading indicator for git repo lint page ([306e0ce](https://github.com/petermetz/dci-lint/commit/306e0ce3446b1476e73f3a6012af7d9e79d3ef52))
* **core:** lint-git-repo service supports .dcilintignore file ([92dc2e0](https://github.com/petermetz/dci-lint/commit/92dc2e041114a1d3790e02e432585953a3aa0ae3))
* **core:** lint-git-repo svc config URL support ([3a56d72](https://github.com/petermetz/dci-lint/commit/3a56d72f36e69df20d61f9c7668e9521f00349dc))
* **core:** lint-git-repo-service ([751c6cc](https://github.com/petermetz/dci-lint/commit/751c6cca0c6c2783bbd87d72246e4be5d9784fa7))
