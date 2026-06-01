---
layout: default
title: Unity C# Attributes Guide
eyebrow: Study Notes
description: Unity와 C#에서 [] 형태로 사용하는 어트리뷰트를 카테고리별로 공부하기 위한 문서 사이트입니다.
---

<div class="hero">
  <div>
    <h2 style="border-top:0; margin-top:0; padding-top:0;">Unity에서 자주 보는 <code>[]</code> 문법을 한 번에 정리한 문서</h2>
    <p>
      <code>[SerializeField]</code>, <code>[System.Serializable]</code>, <code>[MenuItem]</code>, <code>[CreateAssetMenu]</code>처럼
      Unity와 C#에서 사용하는 어트리뷰트를 목적별로 정리했습니다.
      처음에는 치트시트로 감을 잡고, 이후 전체 문서와 예제로 넘어가는 흐름을 추천합니다.
    </p>
  </div>
  <div class="badge-list">
    <span class="badge">SerializeField</span>
    <span class="badge">System.Serializable</span>
    <span class="badge">MenuItem</span>
    <span class="badge">CreateAssetMenu</span>
    <span class="badge">CustomEditor</span>
    <span class="badge">RuntimeInitializeOnLoadMethod</span>
  </div>
</div>

## 바로 보기

<div class="card-grid">
  <a class="card" href="{{ '/cheatsheet/' | relative_url }}">
    <h3>빠른 치트시트</h3>
    <p>하고 싶은 일에서 바로 떠올릴 어트리뷰트를 찾습니다.</p>
  </a>
  <a class="card" href="{{ '/confusing-pairs/' | relative_url }}">
    <h3>헷갈리는 조합</h3>
    <p><code>SerializeField</code>와 <code>Serializable</code>처럼 역할이 비슷해 보이는 것들을 비교합니다.</p>
  </a>
  <a class="card" href="{{ '/examples/' | relative_url }}">
    <h3>실전 예제</h3>
    <p>ScriptableObject, MenuItem, CustomEditor 등을 실제 코드 흐름으로 봅니다.</p>
  </a>
  <a class="card" href="{{ '/attributes/' | relative_url }}">
    <h3>전체 문서</h3>
    <p>원본 Markdown 기반 전체 어트리뷰트 정리 문서를 읽습니다.</p>
  </a>
</div>

## 추천 학습 순서

1. **기본 개념**: 어트리뷰트가 “코드에 붙이는 메타데이터”라는 점부터 이해합니다.
2. **Inspector와 직렬화**: <code>[SerializeField]</code>, <code>[System.Serializable]</code>, <code>[Header]</code>, <code>[Tooltip]</code>을 먼저 봅니다.
3. **컴포넌트 제약**: <code>[RequireComponent]</code>, <code>[DisallowMultipleComponent]</code>로 GameObject 구성 규칙을 익힙니다.
4. **ScriptableObject**: <code>[CreateAssetMenu]</code>로 데이터 에셋 생성 흐름을 익힙니다.
5. **에디터 확장**: <code>[MenuItem]</code>, <code>[ContextMenu]</code>, <code>[CustomEditor]</code>, <code>[CustomPropertyDrawer]</code>를 봅니다.
6. **고급 주제**: <code>[SerializeReference]</code>, <code>[Preserve]</code>, 테스트/NUnit, UI Toolkit 관련 어트리뷰트로 확장합니다.

## 문서 구성 기준

이 사이트는 어트리뷰트를 단순 나열하지 않고 다음 기준으로 정리합니다.

| 기준 | 설명 |
|---|---|
| 어디에 붙이는가 | class, field, method, assembly 등 적용 위치를 구분합니다. |
| 무엇을 바꾸는가 | Inspector 표시, 직렬화, 실행 시점, 에디터 메뉴, 테스트 등 효과를 구분합니다. |
| 언제 쓰는가 | 실무에서 사용하기 좋은 상황과 주의점을 함께 봅니다. |
| 무엇과 헷갈리는가 | 이름이 비슷하거나 결과가 비슷해 보이는 어트리뷰트를 비교합니다. |

## 저장소에 올린 뒤 할 일

1. GitHub 저장소에 이 프로젝트 파일을 업로드합니다.
2. 저장소의 `Settings` → `Pages`로 이동합니다.
3. Source를 `Deploy from a branch`로 선택합니다.
4. Branch는 `main`, Folder는 `/docs`로 선택합니다.
5. 배포 주소가 나오면 접속해서 CSS와 링크가 정상인지 확인합니다.

> CSS나 JS가 깨지면 `docs/_config.yml`의 `baseurl` 값을 저장소 이름에 맞게 수정하세요.
