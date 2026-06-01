---
layout: default
title: 빠른 치트시트
eyebrow: Cheat Sheet
description: Unity C# 어트리뷰트를 상황별로 빠르게 찾는 치트시트입니다.
---

처음에는 모든 어트리뷰트를 외우기보다, **하고 싶은 일에서 어떤 어트리뷰트를 떠올릴지**를 익히는 편이 좋습니다.

## 상황별 빠른 선택표

| 하고 싶은 일 | 떠올릴 어트리뷰트 | 핵심 |
|---|---|---|
| private 필드를 Inspector에 보이고 싶다 | `[SerializeField]` | 캡슐화는 유지하고 Inspector 노출 |
| public 필드를 Inspector에서 숨기고 싶다 | `[HideInInspector]` | 코드 접근은 열어두고 Inspector 표시만 숨김 |
| 커스텀 class를 Inspector에 펼쳐 보이고 싶다 | `[System.Serializable]` | 사용자 정의 데이터 타입을 Unity 직렬화 대상으로 표시 |
| 필드명을 바꿔도 기존 프리팹 값을 살리고 싶다 | `[FormerlySerializedAs]` | 리팩토링 시 저장 데이터 손실 방지 |
| 추상 클래스나 다형성 데이터를 저장하고 싶다 | `[SerializeReference]` | 참조 기반 직렬화 |
| Inspector에 섹션 제목을 넣고 싶다 | `[Header]` | 필드 그룹 구분 |
| Inspector에 설명 툴팁을 넣고 싶다 | `[Tooltip]` | 팀원이 필드 의미를 쉽게 이해 |
| 숫자를 슬라이더로 조절하고 싶다 | `[Range]` | int/float 슬라이더 표시 |
| 숫자의 최소값만 제한하고 싶다 | `[Min]` | 음수 방지 등에 사용 |
| 긴 문자열을 여러 줄로 입력하고 싶다 | `[TextArea]`, `[Multiline]` | 대사, 설명문, 메모 입력 |
| 컴포넌트가 Rigidbody를 반드시 필요로 한다 | `[RequireComponent]` | 필수 컴포넌트 자동 추가 |
| 같은 컴포넌트가 중복 추가되지 않게 하고 싶다 | `[DisallowMultipleComponent]` | 중복 부착 방지 |
| Add Component 메뉴 위치를 정하고 싶다 | `[AddComponentMenu]` | 커스텀 컴포넌트 메뉴 정리 |
| ScriptableObject 생성 메뉴를 만들고 싶다 | `[CreateAssetMenu]` | Assets/Create 메뉴 등록 |
| 런타임 시작 시 자동 초기화하고 싶다 | `[RuntimeInitializeOnLoadMethod]` | 씬 로드 전후 초기화 |
| 실행 순서를 코드로 지정하고 싶다 | `[DefaultExecutionOrder]` | Awake, Start 등 실행 우선순위 조정 |
| Edit Mode에서도 스크립트를 실행하고 싶다 | `[ExecuteAlways]` | 에디터 미리보기, 자동 배치 |
| Unity 상단 메뉴에 도구를 추가하고 싶다 | `[MenuItem]` | Editor 메뉴 명령 등록 |
| 컴포넌트 우클릭 메뉴에 기능을 넣고 싶다 | `[ContextMenu]` | 특정 컴포넌트 전용 실행 메뉴 |
| Inspector를 직접 만들고 싶다 | `[CustomEditor]` | 커스텀 Inspector 작성 |
| 필드 표시 방식을 바꾸고 싶다 | `[CustomPropertyDrawer]` | 커스텀 PropertyAttribute 또는 데이터 타입 표시 |
| 여러 오브젝트 선택 편집을 지원하고 싶다 | `[CanEditMultipleObjects]` | 다중 선택 Inspector 편집 |
| 스크립트 리로드 후 처리하고 싶다 | `[DidReloadScripts]` | 컴파일 이후 콜백 |
| 에디터 로드 시 자동 실행하고 싶다 | `[InitializeOnLoad]`, `[InitializeOnLoadMethod]` | Editor 초기화 |
| 빌드 후 파일을 수정하고 싶다 | `[PostProcessBuild]` | 빌드 산출물 후처리 |
| 커스텀 파일 확장자를 에셋으로 임포트하고 싶다 | `[ScriptedImporter]` | 자체 데이터 포맷 임포터 |
| IL2CPP 빌드에서 리플렉션 대상이 삭제되지 않게 하고 싶다 | `[Preserve]` | 코드 스트리핑 방지 |
| 코루틴 기반 Unity 테스트를 만들고 싶다 | `[UnityTest]` | PlayMode/EditMode 코루틴 테스트 |
| 일반 C# 테스트를 만들고 싶다 | `[Test]` | NUnit 동기 테스트 |
| 더 이상 쓰지 않을 API를 표시하고 싶다 | `[Obsolete]` | 경고 또는 컴파일 에러 처리 |
| enum을 비트 플래그로 쓰고 싶다 | `[Flags]` | 조합 가능한 enum 표현 |
| 네이티브 DLL 함수를 호출하고 싶다 | `[DllImport]` | Native plugin 연동 |

## 먼저 외우면 좋은 1순위

<div class="badge-list">
  <span class="badge">[SerializeField]</span>
  <span class="badge">[System.Serializable]</span>
  <span class="badge">[Header]</span>
  <span class="badge">[Tooltip]</span>
  <span class="badge">[Range]</span>
  <span class="badge">[Min]</span>
  <span class="badge">[RequireComponent]</span>
  <span class="badge">[CreateAssetMenu]</span>
  <span class="badge">[ContextMenu]</span>
  <span class="badge">[MenuItem]</span>
</div>

## 프로젝트가 커지면 중요해지는 2순위

<div class="badge-list">
  <span class="badge">[FormerlySerializedAs]</span>
  <span class="badge">[SerializeReference]</span>
  <span class="badge">[DefaultExecutionOrder]</span>
  <span class="badge">[ExecuteAlways]</span>
  <span class="badge">[RuntimeInitializeOnLoadMethod]</span>
  <span class="badge">[CustomEditor]</span>
  <span class="badge">[CustomPropertyDrawer]</span>
  <span class="badge">[InitializeOnLoad]</span>
  <span class="badge">[PostProcessBuild]</span>
  <span class="badge">[Preserve]</span>
</div>

## 암기용 한 줄 정리

| 키워드 | 한 줄 느낌 |
|---|---|
| `Serialize` | Unity가 값을 저장하고 Inspector에 보여주는 문제 |
| `Editor` | Unity 에디터 화면이나 도구를 확장하는 문제 |
| `RuntimeInitialize` | 게임 실행 시작 시점 초기화 문제 |
| `RequireComponent` | GameObject에 필요한 부품을 강제하는 문제 |
| `CreateAssetMenu` | ScriptableObject를 에셋으로 쉽게 만들기 위한 문제 |
| `Preserve` | 빌드 최적화 때문에 코드가 사라지는 것을 막는 문제 |
