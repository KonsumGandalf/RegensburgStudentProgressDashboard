# Regensburg Student Progress Dashboard

A tool to automate scanning & monitoring websites & applications for several health topics, such as security,
performance and uptime.

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#introduction">Introduction</a></li>
        <li><a href="#objectives">Objectives</a></li>
      </ul>
    </li>
    <li>
      <a href="#understand-this-workspace">Understand this workspace</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#start-the-platform">Start the platform</a></li>
      </ul>
    </li>
    <li>
      <a href="#apps">Apps</a>
      <a href="#domains">Domains</a>
      <ul>
        <li>
            <a href="#grade">Grade</a>
            <ul>
                <li><a href="#backend">Backend</a></li>
            </ul>
        </li>
        <li>
            <a href="#Shared">Shared</a>
            <ul>
                <li><a href="#backend">Backend</a></li>
            </ul>
        </li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

# About The Project

This project was developed as part of my bachelor thesis at the [OTH Regensburg](https://www.oth-regensburg.de/).

## Introduction

Gamification is a popular approach to motivate and engage users in various contexts,
including education. In this Bachelor thesis, I explore the potential of gamification in
higher education and present a complementary learning platform designed and implemented
to improve student engagement and performance understanding.

## Objectives

The main objectives of this project are:

- To explore the theoretical foundations of gamification in education
- To design and develop a complementary learning platform that incorporates gamification elements and mechanics

# Understand this workspace

This tool is built within a Nx workspace and employs Angular for the frontend,
NestJS for the backend, and PostgresSQL as the database.
The database is configured to run inside a docker container by default.

## Installation

_Below is an example of how you can instruct your audience on installing and
setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo

```sh
git clone https://github.com/KonsumGandalf/rsdp
```

2. Install NPM packages

```shell
npm install
```

## Start the platform

1. start the database

```shell
docker compose up
```

2. start the backend

```shell
nx serve backend
```

3. start the frontend

```shell
nx serve frontend
```

# Apps

| Name      | Path                         | Description                 |
| --------- | ---------------------------- | --------------------------- |
| `backend` | [apps/backend](apps/backend) | The backend of the platform |

# Domains

## Grade

### Backend

| Name                          | Path                                                   | Description                                                |
| ----------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| `grade-backend-github`        | [libs/grade/backend/github](libs/grade/backend/github) | Defines an api for github to report grades                 |
| `grade-backend-common-models` | [libs/shared/common/models](libs/shared/common/models) | A collection of common models used inside the grade domain |

## Shared

### Backend

| Name                     | Path                                                 | Description                                        |
| ------------------------ | ---------------------------------------------------- | -------------------------------------------------- |
| `shared-backend-swagger` | [libs/shared/nest/swagger](libs/shared/nest/swagger) | Helps to integrate Swagger into the NestJS project |

<!-- CONTACT -->

## Contact

David Schmidt - [Instagram]: @[\_life_of_david](https://www.instagram.com/_life_of_david/)

David Schmidt - [LinkedIn]: @[David Schmidt](https://www.linkedin.com/in/david-schmidt-09b69b1b6)

Project Link: [Regensburg Student Progress Dashboard](https://github.com/users/KonsumGandalf/projects/8)

<p align="right">(<a href="#top">back to top</a>)</p>

## Resources

- Nx Workspace: https://nx.dev/getting-started/intro
- NestJS: https://nestjs.com/

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

I would like to express my sincere gratitude to
Professor [Prof. Dr. Markus Heckner](https://www.linkedin.com/in/mheckner) and his scientific
employee [Julia Ruhland](https://www.xing.com/profile/Julia_Ruhland6) for
their invaluable support and guidance throughout this project.

<p align="right">(<a href="#top">back to top</a>)</p>
