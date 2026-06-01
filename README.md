# Unity C# Attributes Guide

Unity와 C#에서 `[]` 형태로 사용하는 어트리뷰트를 정리한 GitHub Pages용 정적 문서 사이트입니다.

## 구성

```text
.
├─ README.md
└─ docs/
   ├─ _config.yml
   ├─ _layouts/
   │  └─ default.html
   ├─ assets/
   │  ├─ css/style.css
   │  └─ js/site.js
   ├─ index.md
   ├─ attributes.md
   ├─ cheatsheet.md
   ├─ confusing-pairs.md
   └─ examples.md
```

## GitHub Pages 배포 방법

1. 이 폴더 내용을 GitHub 저장소에 업로드합니다.
2. GitHub 저장소에서 `Settings` → `Pages`로 이동합니다.
3. `Build and deployment`에서 Source를 `Deploy from a branch`로 설정합니다.
4. Branch는 `main`, Folder는 `/docs`로 선택합니다.
5. 저장 후 표시되는 GitHub Pages 주소로 접속합니다.

## CSS/JS가 깨질 때

저장소 이름이 URL 경로에 포함되는 프로젝트 페이지라면 `docs/_config.yml`의 `baseurl`을 아래처럼 수정하세요.

```yml
baseurl: "/저장소이름"
```

예: `https://username.github.io/unity-attributes-guide/`라면

```yml
baseurl: "/unity-attributes-guide"
```
