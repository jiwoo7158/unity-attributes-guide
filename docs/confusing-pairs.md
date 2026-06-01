---
layout: default
title: 헷갈리는 어트리뷰트 조합
eyebrow: Compare
description: Unity C# 어트리뷰트 중 역할이 비슷해 보이는 조합을 비교합니다.
---

Unity 어트리뷰트는 이름만 보면 비슷해 보이지만, 실제로는 **붙이는 위치와 해결하는 문제가 다른 경우**가 많습니다.

## `[SerializeField]` vs `public`

```csharp
public int hp;
```

- Inspector에 보입니다.
- 다른 클래스에서 접근할 수 있습니다.
- 값 보호가 약해집니다.

```csharp
[SerializeField]
private int hp;
```

- Inspector에 보입니다.
- 다른 클래스에서 마음대로 바꾸기 어렵습니다.
- Unity 프로젝트에서 더 자주 권장되는 형태입니다.

**정리:** Inspector에 보이게 하려는 목적이라면 `public`보다 `[SerializeField] private`을 먼저 생각합니다.

---

## `[System.Serializable]` vs `[SerializeField]`

```csharp
[System.Serializable]
public class ItemData
{
    public string itemName;
    public int count;
}
```

`[System.Serializable]`은 **타입 자체**를 Unity가 직렬화 가능한 데이터 구조로 볼 수 있게 합니다.

```csharp
[SerializeField]
private ItemData item;
```

`[SerializeField]`는 **특정 필드**를 Unity 직렬화 대상으로 만듭니다.

**정리:** 커스텀 class를 private 필드로 Inspector에 보이게 하려면 보통 둘 다 필요합니다.

---

## `[SerializeReference]` vs `ScriptableObject`

| 구분 | `[SerializeReference]` | `ScriptableObject` |
|---|---|---|
| 저장 위치 | host object 내부 | 별도 에셋 |
| 공유 | 같은 host 내부 참조에 적합 | 여러 오브젝트가 공유하기 좋음 |
| 다형성 | 추상 클래스, 인터페이스 구조에 유리 | 에셋 참조 중심으로 관리 |
| 사용 예 | 조건 노드, 전략 객체, 작은 그래프 데이터 | 아이템 데이터, 적 데이터, 스킬 데이터 |
| 관리 난이도 | Inspector 지원이 약할 수 있음 | 에셋 단위 관리가 명확함 |

**정리:** 여러 곳에서 공유할 데이터라면 `ScriptableObject`, 특정 오브젝트 내부의 다형성 데이터라면 `[SerializeReference]`를 고려합니다.

---

## `[ContextMenu]` vs `[MenuItem]`

| 구분 | `[ContextMenu]` | `[MenuItem]` |
|---|---|---|
| 네임스페이스 | `UnityEngine` | `UnityEditor` |
| 붙이는 대상 | 인스턴스 메서드 | static 메서드 |
| 표시 위치 | 컴포넌트 Inspector 우클릭 메뉴 | Unity 상단 메뉴, Assets, GameObject 등 |
| 사용 목적 | 특정 컴포넌트에 붙은 테스트 기능 | 프로젝트 전체에서 쓰는 에디터 도구 |

```csharp
public class EnemySpawner : MonoBehaviour
{
    [ContextMenu("Spawn Test Enemy")]
    private void SpawnTestEnemy()
    {
    }
}
```

```csharp
using UnityEditor;

public static class CombatMenu
{
    [MenuItem("Combat/Setup Animated Agent Prefabs")]
    private static void Setup()
    {
    }
}
```

**정리:** 특정 컴포넌트의 작은 기능이면 `[ContextMenu]`, 에디터 메뉴에 등록할 도구면 `[MenuItem]`입니다.

---

## `[ExecuteAlways]` vs `[ExecuteInEditMode]`

| 구분 | `[ExecuteAlways]` | `[ExecuteInEditMode]` |
|---|---|---|
| 용도 | Play Mode가 아니어도 실행 | 예전부터 쓰이던 Edit Mode 실행 |
| 현재 사용 | 새 코드에서 우선 고려 | 레거시 코드에서 자주 봄 |
| 주의점 | Edit Mode에서 씬 데이터 변경 주의 | Prefab Mode 관련 동작까지 확인 필요 |

```csharp
[ExecuteAlways]
public class AutoAligner : MonoBehaviour
{
    private void Update()
    {
        if (Application.isPlaying)
        {
            return;
        }

        // Edit Mode 전용 미리보기 코드
    }
}
```

**정리:** 새로 작성한다면 대체로 `[ExecuteAlways]`를 먼저 보고, Play Mode와 Edit Mode를 반드시 구분합니다.

---

## `[Range]` vs `[Min]`

```csharp
[Range(0, 100)]
public int hp;
```

- Inspector에서 슬라이더로 표시됩니다.
- 최소값과 최대값이 모두 있을 때 적합합니다.

```csharp
[Min(0)]
public int gold;
```

- 최소값만 제한합니다.
- 최대값이 없는 값에 적합합니다.

**정리:** 범위가 명확하면 `[Range]`, 음수만 막고 싶으면 `[Min]`입니다.

---

## `[CustomEditor]` vs `[CustomPropertyDrawer]`

| 구분 | `[CustomEditor]` | `[CustomPropertyDrawer]` |
|---|---|---|
| 바꾸는 대상 | 컴포넌트나 ScriptableObject의 Inspector 전체 | 특정 필드나 특정 serializable 타입의 표시 방식 |
| 대표 클래스 | `Editor` | `PropertyDrawer` |
| 사용 예 | 버튼이 있는 EnemySpawner Inspector | ReadOnly 필드, SceneName 필드, Stat 표시 방식 |

**정리:** Inspector 전체를 바꾸려면 `[CustomEditor]`, 필드 하나의 표현을 바꾸려면 `[CustomPropertyDrawer]`입니다.

---

## `[InitializeOnLoad]` vs `[RuntimeInitializeOnLoadMethod]`

| 구분 | `[InitializeOnLoad]` | `[RuntimeInitializeOnLoadMethod]` |
|---|---|---|
| 실행 환경 | Unity Editor | 게임 런타임 |
| 붙이는 대상 | 클래스 | static 메서드 |
| 대표 용도 | 에디터 로드 시 도구 초기화 | 앱 실행 시 매니저 초기화 |

**정리:** 에디터 도구 초기화는 `[InitializeOnLoad]`, 게임 실행 초기화는 `[RuntimeInitializeOnLoadMethod]`입니다.
