# Changelog

## [1.1.0](https://github.com/KonsumGandalf/rsdp/compare/rsdp-v1.0.0...rsdp-v1.1.0) (2023-05-21)


### Features

* **base-application:** feat(base-application):  ([48eb633](https://github.com/KonsumGandalf/rsdp/commit/48eb633c53529c57d0ffe386938a9f37bee50915)), closes [#16](https://github.com/KonsumGandalf/rsdp/issues/16)
* **base-application:** feat(base-application):  ([89a0e9b](https://github.com/KonsumGandalf/rsdp/commit/89a0e9b587f82230716cf83810ca48c58ab87cc3)), closes [#16](https://github.com/KonsumGandalf/rsdp/issues/16)
* **base-application:** feat(base-application):  ([56e5932](https://github.com/KonsumGandalf/rsdp/commit/56e5932b4bd2b21429be08a9f1eb3140e1db6564)), closes [#16](https://github.com/KonsumGandalf/rsdp/issues/16)
* **base-application:** feat(base-application):  ([322725d](https://github.com/KonsumGandalf/rsdp/commit/322725d33ab3fd3b18485bb1e645302105265a5d)), closes [#13](https://github.com/KonsumGandalf/rsdp/issues/13)
* **base-application:** implement sessions to the base application ([b4e36cb](https://github.com/KonsumGandalf/rsdp/commit/b4e36cbe92ff47a68ae1fcc0e6594b223dcbc098))
* **base-application:** Implement student insights lib and outsource routes to own file ([2a18607](https://github.com/KonsumGandalf/rsdp/commit/2a18607c7f703544d40cae331485d64698c2ac67))
* **base-application:** integrate auto caching to reduce request time ([304afed](https://github.com/KonsumGandalf/rsdp/commit/304afed3f36c6e40d3fc182f44264af17249791a))
* **challenge-management-backend-challenge-management:** Add new service functions for integration with insights library ([1c10250](https://github.com/KonsumGandalf/rsdp/commit/1c10250c4e3d6c8e23e2960beff887d5ec1e2dd7))
* **challenge-management-backend-semester-management:** Integrate semester-management library and related components ([1d407fd](https://github.com/KonsumGandalf/rsdp/commit/1d407fda4304fc3d3efb61cc3ee7a846d9420b34)), closes [#29](https://github.com/KonsumGandalf/rsdp/issues/29)
* **grade-backend-challenge:** Add challenge library for creating and managing of challenges ([1e68d1d](https://github.com/KonsumGandalf/rsdp/commit/1e68d1dfc7207867447ac44cd57532e9e1b4acb0)), closes [#15](https://github.com/KonsumGandalf/rsdp/issues/15)
* **moodle-management-backend-moodle-management:** feat(moodle-management-backend-moodle-management):  ([792b21f](https://github.com/KonsumGandalf/rsdp/commit/792b21f2d0a938cb2c855d7326278471ab69b598)), closes [#29](https://github.com/KonsumGandalf/rsdp/issues/29)
* **moodle-management-backend-request-helper:** feat(moodle-management-backend-request-helper):  ([6c3c1b3](https://github.com/KonsumGandalf/rsdp/commit/6c3c1b311fd30a6b0ece59cc0ac64f015e311088)), closes [#29](https://github.com/KonsumGandalf/rsdp/issues/29)
* **shared-backend-test-util:** Add RepositoryMock class for simulating TypeORM repository behavior in tests ([eb587d8](https://github.com/KonsumGandalf/rsdp/commit/eb587d896cf9091b14db63eaabc688c5307405c9)), closes [#16](https://github.com/KonsumGandalf/rsdp/issues/16)
* **shared-backend-test-util:** implement MockConfigService to support testing ([70199fe](https://github.com/KonsumGandalf/rsdp/commit/70199fe81c4b8b6c4522cdbf2c3b79a03672f1b6))
* **shared-backend-test-util:** Update Commitlint ([d48363a](https://github.com/KonsumGandalf/rsdp/commit/d48363a18529e9cea26e65ad89979ef797276fce)), closes [#16](https://github.com/KonsumGandalf/rsdp/issues/16)
* **shared-backend-utils:** add generic repository service ([34cceb6](https://github.com/KonsumGandalf/rsdp/commit/34cceb6ec5b1094756d50f1cfe526ba80366554b))
* **shared-backend-utils:** add resource guard and helper function ([43da3f2](https://github.com/KonsumGandalf/rsdp/commit/43da3f24955d3071b186f013dcf41ac952cb5ff5))
* **shared-backend-utils:** Develop utility library for common models and helper functions ([c4a3a3f](https://github.com/KonsumGandalf/rsdp/commit/c4a3a3f9aecec26b6d08c99b09520bb84ce80b4a)), closes [#17](https://github.com/KonsumGandalf/rsdp/issues/17)
* **shared-backend-utils:** integrate resource-owner guard ([4d2c1de](https://github.com/KonsumGandalf/rsdp/commit/4d2c1de5d7043bc41e0cc7985d17db31e5c92289))
* **student-submissions-backend-common-models:** add common lib with interfaces to communicate about submission-insights ([3db4c6b](https://github.com/KonsumGandalf/rsdp/commit/3db4c6bfc874f8520bca8f4e07643a2184db8383))
* **student-submissions-backend-common-models:** add new models, enums, function and interfaces ([e36c156](https://github.com/KonsumGandalf/rsdp/commit/e36c156b2fc1863c6de88ec5107440ef0b9d5ee3))
* **student-submissions-backend-common-models:** initialize common models library ([c0aeaf5](https://github.com/KonsumGandalf/rsdp/commit/c0aeaf5c3d9426a888c274d20b1709998c65acbc))
* **student-submissions-backend-github-submissions:** add new service function to allow the submission-insight lib to calculate the requested values ([301fbd0](https://github.com/KonsumGandalf/rsdp/commit/301fbd0823455cf039655798bc17b3843ba602e9)), closes [#27](https://github.com/KonsumGandalf/rsdp/issues/27)
* **student-submissions-backend-github-submissions:** initialize GitHub submissions library ([253dbc8](https://github.com/KonsumGandalf/rsdp/commit/253dbc86ce2490abde058517d2d99ef7bbe981d4))
* **student-submissions-backend-github-submissions:** integrate library for handling GitHub action requests for submission results ([8a2d52e](https://github.com/KonsumGandalf/rsdp/commit/8a2d52e5ba766763db7d84e375a8321b59a3a383))
* **student-submissions-backend-submission-insights:** integrate library which allows the frontend to get the state of the student submissions ([dc2b231](https://github.com/KonsumGandalf/rsdp/commit/dc2b2310797139dea0f8c0706f3ad5eb0e0f7dbc)), closes [#27](https://github.com/KonsumGandalf/rsdp/issues/27)
* **student-submissions-backend-submission-management:** initialize submission management library ([4bd42c2](https://github.com/KonsumGandalf/rsdp/commit/4bd42c28724bb16e7a21e272b526d9a91fdb3239))
* **student-submissions-backend-submission-management:** restructure lib as internal lib without controller as a service handler ([1c41fb2](https://github.com/KonsumGandalf/rsdp/commit/1c41fb272802effff45fec11501e5a9fef093e33))
* **student-submissions-backend:** Add support for processing MoodleSubmissions ([1ceca22](https://github.com/KonsumGandalf/rsdp/commit/1ceca22be0b5311617acf89545da6c6928d4e500))
* **uml:** feat(uml):  ([ad6294a](https://github.com/KonsumGandalf/rsdp/commit/ad6294a36e12d7ee348bb514cb252f6d7d9702ec)), closes [#11](https://github.com/KonsumGandalf/rsdp/issues/11)
* **uml:** design request pattern for moodle submissions ([49c0dc4](https://github.com/KonsumGandalf/rsdp/commit/49c0dc4d6c28157b4722d0a62472ff1133d23fde))
* **user-backend-common-models:** feat(user-backend-common-models):  ([36dd915](https://github.com/KonsumGandalf/rsdp/commit/36dd915c98bc1b52ea55a1a86a878096ad7509e8)), closes [#24](https://github.com/KonsumGandalf/rsdp/issues/24)
* **user-backend-common-models:** new student and tutor entity to differentiate between user types ([2989e21](https://github.com/KonsumGandalf/rsdp/commit/2989e2158873ad24288c0832edf7301b3edaf62b))
* **user-backend-github-authorization:** Initial implementation of GitHub authorization ([d71396c](https://github.com/KonsumGandalf/rsdp/commit/d71396ca0f616ac3e60bb7fa3173c3b8f5c5d403))
* **user-backend-user-authentication:** feat(user-backend-user-authentication):  ([5b9effc](https://github.com/KonsumGandalf/rsdp/commit/5b9effc47acd2e9baa8a78c9febbeae3f321cb2f)), closes [#24](https://github.com/KonsumGandalf/rsdp/issues/24)
* **user-backend-user-mail-management:** feat(user-backend-user-mail-management):  ([5331134](https://github.com/KonsumGandalf/rsdp/commit/533113401a14e097b8e08d64ca9e1887ec1f3567)), closes [#24](https://github.com/KonsumGandalf/rsdp/issues/24)
* **user-backend-user-management:** implement User management and JWT authentication ([6452bfb](https://github.com/KonsumGandalf/rsdp/commit/6452bfb3d5a6926eb540632bb3370cb88c123a83)), closes [#24](https://github.com/KonsumGandalf/rsdp/issues/24)
* **user-backend:** Add support for storing Moodle User Id ([305b58c](https://github.com/KonsumGandalf/rsdp/commit/305b58caac9910e83bf08b933bec6b450314005d))


### Bug Fixes

* **base-application:** fix(base-application):  ([9c3c531](https://github.com/KonsumGandalf/rsdp/commit/9c3c5318d4d9e1602676218118a4093251ab847e))
* **challenge-management-backend-challenge-management:** reimport entities due to changed location ([bfd343a](https://github.com/KonsumGandalf/rsdp/commit/bfd343a0406d26720e0e69694369fce97c5a7769))
* **devops:** fix(devops):  ([64e3705](https://github.com/KonsumGandalf/rsdp/commit/64e3705a10dbfbb99debffd9cf6ca8fe6678443f))
* **student-submissions-backend-submission-management:** Add base implementation for submission-management ([d7f5004](https://github.com/KonsumGandalf/rsdp/commit/d7f5004c26cff54d96f43effb554326f6b706c07))


### Miscellaneous

* **devops:** chore(devops):  ([b8b6424](https://github.com/KonsumGandalf/rsdp/commit/b8b6424d00c806776d52f91624cc38972915f974))
* **devops:** fix prettier settings, update project to include new libs ([139fb32](https://github.com/KonsumGandalf/rsdp/commit/139fb32338156a0da2da14a4cb4de0ce2bd19294))
* **user-backend:** Support shorter scopes ([809f59d](https://github.com/KonsumGandalf/rsdp/commit/809f59d4a682aff330829fca40996b63c09a8b6a))

## 1.0.0 (2023-04-12)


### Features

* **base-application:** Add GitHub Actions ([05e4ea3](https://github.com/KonsumGandalf/rsdp/commit/05e4ea3c77dbd7185f6895a96f4ff5d0c617753b)), closes [#5](https://github.com/KonsumGandalf/rsdp/issues/5)
* **base-application:** Add GitHub Actions ([b57abdb](https://github.com/KonsumGandalf/rsdp/commit/b57abdb7dbd5aa8225f5e9ddc2c303745b80c613)), closes [#5](https://github.com/KonsumGandalf/rsdp/issues/5)
* **base-application:** Add GitHub Actions ([430ab3b](https://github.com/KonsumGandalf/rsdp/commit/430ab3b3b1dec198b8c4718d5355a04624fec945)), closes [#5](https://github.com/KonsumGandalf/rsdp/issues/5)
* **base-application:** Add Husky and Commitlint ([fd90171](https://github.com/KonsumGandalf/rsdp/commit/fd90171557667e88bd8b0a0fa6ab4062f7e0d390)), closes [#3](https://github.com/KonsumGandalf/rsdp/issues/3)
* **base-application:** Add Husky and Commitlint ([8c94977](https://github.com/KonsumGandalf/rsdp/commit/8c94977418e4b72e77c69784c1c757a0db32de58)), closes [#3](https://github.com/KonsumGandalf/rsdp/issues/3)
* **base-application:** Config Prettier, Eslint, Ts, Nx ([32c1d8c](https://github.com/KonsumGandalf/rsdp/commit/32c1d8cf46ba96a8801b640c1f7e57daa76ab28b)), closes [#2](https://github.com/KonsumGandalf/rsdp/issues/2)
* **uml:** Add UML diagrams for project using PlantUML ([98e2d6e](https://github.com/KonsumGandalf/rsdp/commit/98e2d6e86d8fbeef63571023824f97ccb6b14df5)), closes [#7](https://github.com/KonsumGandalf/rsdp/issues/7)
