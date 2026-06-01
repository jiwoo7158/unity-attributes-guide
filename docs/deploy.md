---
layout: default
title: GitHub Pages 배포 방법
eyebrow: Deploy
description: 이 문서 사이트를 GitHub Pages로 배포하는 방법입니다.
---

이 프로젝트는 `/docs` 폴더를 GitHub Pages 게시 소스로 사용하는 구성을 기준으로 만들어졌습니다.

## 1. 저장소에 파일 올리기

아래 구조가 저장소에 그대로 들어가면 됩니다.

```text
.
├─ README.md
└─ docs/
   ├─ _config.yml
   ├─ _layouts/default.html
   ├─ assets/css/style.css
   ├─ assets/js/site.js
   ├─ index.md
   ├─ attributes.md
   ├─ cheatsheet.md
   ├─ confusing-pairs.md
   ├─ examples.md
   └─ deploy.md
```

## 2. GitHub Pages 설정하기

1. GitHub 저장소에 접속합니다.
2. `Settings` 메뉴로 들어갑니다.
3. 왼쪽 메뉴에서 `Pages`를 선택합니다.
4. `Build and deployment`에서 Source를 `Deploy from a branch`로 선택합니다.
5. Branch는 `main`, Folder는 `/docs`로 선택합니다.
6. 저장하면 잠시 후 배포 주소가 표시됩니다.

## 3. CSS와 JS가 깨질 때

저장소 이름이 URL에 포함되는 GitHub Pages 프로젝트 사이트라면 `baseurl` 설정이 필요할 수 있습니다.

예를 들어 배포 주소가 아래처럼 나온다면:

```text
https://username.github.io/unity-attributes-guide/
```

`docs/_config.yml`을 이렇게 수정합니다.

```yml
baseurl: "/unity-attributes-guide"
```

## 4. 문서 수정 방법

| 수정하고 싶은 것 | 수정할 파일 |
|---|---|
| 첫 화면 내용 | `docs/index.md` |
| 전체 어트리뷰트 문서 | `docs/attributes.md` |
| 빠른 요약표 | `docs/cheatsheet.md` |
| 비교 설명 | `docs/confusing-pairs.md` |
| 코드 예제 | `docs/examples.md` |
| 사이트 제목, 설명, 메뉴 | `docs/_config.yml` |
| 디자인 | `docs/assets/css/style.css` |
| 검색/빠른 이동 | `docs/assets/js/site.js` |

## 5. 추천 관리 방식

처음에는 Markdown 파일만 수정하면서 운영하고, 나중에 문서가 많아지면 `categories/` 폴더를 만들어 세부 문서를 분리하는 방식이 좋습니다.

예시:

```text
docs/categories/
├─ inspector.md
├─ serialization.md
├─ editor.md
├─ runtime.md
└─ test-framework.md
```

이렇게 분리하면 사이트가 커져도 관리하기 편해집니다.
