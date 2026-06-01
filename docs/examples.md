---
layout: default
title: 실전 예제
eyebrow: Examples
description: Unity C# 어트리뷰트를 실제 코드에서 어떻게 조합하는지 보여주는 예제 모음입니다.
---

이 페이지는 어트리뷰트를 따로 외우는 것보다, **실제 Unity 코드에서 어떤 조합으로 쓰이는지**를 보기 위한 예제 모음입니다.

## 예제 1. private 필드를 Inspector에 노출하기

```csharp
using UnityEngine;

public class PlayerHealth : MonoBehaviour
{
    [Header("Health")]
    [SerializeField]
    [Min(1)]
    private int maxHp = 100;

    [SerializeField]
    [Tooltip("현재 체력은 런타임 중 변경됩니다.")]
    private int currentHp;

    public int MaxHp => maxHp;
    public int CurrentHp => currentHp;

    private void Awake()
    {
        currentHp = maxHp;
    }
}
```

사용한 어트리뷰트:

| 어트리뷰트 | 역할 |
|---|---|
| `[Header]` | Inspector에서 섹션 제목 표시 |
| `[SerializeField]` | private 필드를 Inspector에 노출 |
| `[Min]` | 최소값 제한 |
| `[Tooltip]` | 필드 설명 표시 |

---

## 예제 2. ScriptableObject 아이템 데이터 만들기

```csharp
using UnityEngine;
using UnityEngine.Serialization;

[System.Serializable]
public class ItemStat
{
    [Min(0)]
    public int attackBonus;

    [Min(0)]
    public int defenseBonus;
}

[CreateAssetMenu(fileName = "New Item", menuName = "Game Data/Item")]
public class ItemData : ScriptableObject
{
    [Header("Basic")]
    [SerializeField]
    private string itemName;

    [SerializeField]
    private Sprite icon;

    [Header("Stats")]
    [SerializeField]
    private ItemStat stat;

    [FormerlySerializedAs("desc")]
    [SerializeField]
    [TextArea(3, 6)]
    private string description;
}
```

사용한 어트리뷰트:

| 어트리뷰트 | 역할 |
|---|---|
| `[System.Serializable]` | `ItemStat`을 Inspector에서 펼칠 수 있게 함 |
| `[CreateAssetMenu]` | Assets/Create 메뉴에 생성 항목 추가 |
| `[FormerlySerializedAs]` | 예전 필드명 데이터를 유지 |
| `[TextArea]` | 긴 설명문 입력에 적합한 UI 제공 |

---

## 예제 3. 필수 컴포넌트 강제하기

```csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
[RequireComponent(typeof(CapsuleCollider))]
[DisallowMultipleComponent]
public class CharacterMotor : MonoBehaviour
{
    private Rigidbody rb;

    private void Awake()
    {
        rb = GetComponent<Rigidbody>();
    }
}
```

포인트:

- `CharacterMotor`를 붙이면 `Rigidbody`, `CapsuleCollider`가 함께 필요합니다.
- 같은 GameObject에 `CharacterMotor`가 여러 개 붙는 것을 막습니다.

---

## 예제 4. 컴포넌트 우클릭 메뉴 만들기

```csharp
using UnityEngine;

public class EnemySpawner : MonoBehaviour
{
    [SerializeField]
    private GameObject enemyPrefab;

    [ContextMenu("Spawn Test Enemy")]
    private void SpawnTestEnemy()
    {
        if (enemyPrefab == null)
        {
            Debug.LogWarning("enemyPrefab이 비어 있습니다.");
            return;
        }

        Instantiate(enemyPrefab, transform.position, transform.rotation);
    }
}
```

`[ContextMenu]`는 특정 컴포넌트에 붙은 테스트 함수나 자동 세팅 함수를 빠르게 실행할 때 좋습니다.

---

## 예제 5. Unity 상단 메뉴에 에디터 도구 추가하기

> 이 코드는 `Assets/Editor` 폴더 안에 두는 것을 권장합니다.

```csharp
using UnityEditor;
using UnityEngine;

public static class CombatPrefabSetupTool
{
    [MenuItem("Combat/Setup Animated Agent Prefabs")]
    private static void SetupAnimatedAgentPrefabs()
    {
        foreach (GameObject obj in Selection.gameObjects)
        {
            var animator = obj.GetComponent<Animator>();
            if (animator == null)
            {
                animator = obj.AddComponent<Animator>();
            }

            var agent = obj.GetComponent<UnityEngine.AI.NavMeshAgent>();
            if (agent == null)
            {
                agent = obj.AddComponent<UnityEngine.AI.NavMeshAgent>();
            }

            EditorUtility.SetDirty(obj);
        }

        Debug.Log("Selected prefabs setup complete.");
    }

    [MenuItem("Combat/Setup Animated Agent Prefabs", true)]
    private static bool ValidateSetupAnimatedAgentPrefabs()
    {
        return Selection.gameObjects != null && Selection.gameObjects.Length > 0;
    }
}
```

포인트:

| 코드 | 의미 |
|---|---|
| `[MenuItem("Combat/...")]` | Unity 상단 메뉴에 항목 추가 |
| static 메서드 | `MenuItem`은 static 메서드에 붙음 |
| 두 번째 `MenuItem(..., true)` | 메뉴 활성화 여부를 판단하는 검증 함수 |
| `Selection.gameObjects` | 현재 선택된 오브젝트 목록 |

---

## 예제 6. 버튼이 있는 Custom Inspector 만들기

> Editor 코드는 `Assets/Editor` 폴더 안에 둡니다.

런타임 컴포넌트:

```csharp
using UnityEngine;

public class PatrolPath : MonoBehaviour
{
    [SerializeField]
    private Transform[] points;

    public void ResetPointNames()
    {
        if (points == null)
        {
            return;
        }

        for (int i = 0; i < points.Length; i++)
        {
            if (points[i] != null)
            {
                points[i].name = $"Patrol Point {i + 1}";
            }
        }
    }
}
```

Editor 코드:

```csharp
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(PatrolPath))]
[CanEditMultipleObjects]
public class PatrolPathEditor : Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();

        if (GUILayout.Button("Reset Point Names"))
        {
            foreach (Object selectedTarget in targets)
            {
                var path = (PatrolPath)selectedTarget;
                path.ResetPointNames();
                EditorUtility.SetDirty(path);
            }
        }
    }
}
```

포인트:

- `[CustomEditor]`는 특정 타입의 Inspector 전체를 커스터마이즈합니다.
- `[CanEditMultipleObjects]`는 여러 개 선택했을 때도 편집 가능하다는 표시입니다.
- 다중 편집을 제대로 하려면 `targets` 또는 `serializedObject`를 고려합니다.

---

## 예제 7. ReadOnly 커스텀 어트리뷰트 만들기

런타임 코드:

```csharp
using UnityEngine;

public class ReadOnlyAttribute : PropertyAttribute
{
}
```

Editor 코드:

```csharp
using UnityEditor;
using UnityEngine;

[CustomPropertyDrawer(typeof(ReadOnlyAttribute))]
public class ReadOnlyDrawer : PropertyDrawer
{
    public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
    {
        bool oldEnabled = GUI.enabled;
        GUI.enabled = false;
        EditorGUI.PropertyField(position, property, label, true);
        GUI.enabled = oldEnabled;
    }
}
```

사용 코드:

```csharp
using UnityEngine;

public class GeneratedIdExample : MonoBehaviour
{
    [ReadOnly]
    [SerializeField]
    private string generatedId;

    [ContextMenu("Generate ID")]
    private void GenerateId()
    {
        generatedId = System.Guid.NewGuid().ToString();
    }
}
```

포인트:

- 직접 만든 `PropertyAttribute`는 런타임 코드에 둘 수 있습니다.
- `CustomPropertyDrawer`는 Editor 코드에 둬야 합니다.
- 이런 방식으로 프로젝트 전용 Inspector 규칙을 만들 수 있습니다.

---

## 예제 8. 런타임 초기화와 에디터 초기화 구분하기

런타임 시작 시 초기화:

```csharp
using UnityEngine;

public static class RuntimeBootstrap
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    private static void Init()
    {
        Debug.Log("런타임 첫 씬 로드 전에 실행");
    }
}
```

에디터 로드 시 초기화:

```csharp
using UnityEditor;
using UnityEngine;

[InitializeOnLoad]
public static class EditorBootstrap
{
    static EditorBootstrap()
    {
        Debug.Log("에디터 로드 또는 스크립트 리로드 시 실행");
    }
}
```

정리:

| 목적 | 사용할 어트리뷰트 |
|---|---|
| 게임 실행 시 초기화 | `[RuntimeInitializeOnLoadMethod]` |
| Unity Editor 로드 시 초기화 | `[InitializeOnLoad]`, `[InitializeOnLoadMethod]` |

---

## 예제 9. Unity Test Framework 테스트 작성하기

일반 동기 테스트:

```csharp
using NUnit.Framework;

public class DamageCalculatorTests
{
    [Test]
    public void Damage_Cannot_Be_Negative()
    {
        int damage = DamageCalculator.Calculate(-10, 5);
        Assert.GreaterOrEqual(damage, 0);
    }
}
```

코루틴 테스트:

```csharp
using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

public class SpawnTests
{
    [UnityTest]
    public IEnumerator Enemy_Spawns_After_One_Frame()
    {
        var go = new GameObject("Spawner");
        go.AddComponent<EnemySpawner>();

        yield return null;

        Assert.IsNotNull(GameObject.FindWithTag("Enemy"));
    }
}
```

정리:

- `[Test]`는 일반 C# 테스트에 적합합니다.
- `[UnityTest]`는 프레임 대기, 코루틴, PlayMode 흐름 검증에 적합합니다.
