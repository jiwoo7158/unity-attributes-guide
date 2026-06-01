---
layout: default
title: 전체 어트리뷰트 문서
eyebrow: Full Guide
description: Unity C# 어트리뷰트 전체 정리 문서입니다.
---

> 기준: Unity 6.x 공식 Scripting API와 Unity Test Framework, Microsoft C# 문서를 기준으로 정리했습니다.  
> 목표: `[]` 형태로 붙이는 Unity/C# 어트리뷰트를 한 번에 훑고, “어디에 붙이고”, “무슨 효과가 있고”, “언제 쓰는지”를 빠르게 이해하는 것입니다.  
> 주의: Unity 버전, 설치된 패키지, 렌더 파이프라인, 에디터 확장 환경에 따라 지원 여부가 달라질 수 있습니다. 특히 `UnityEditor` 네임스페이스의 어트리뷰트는 빌드된 앱 런타임 코드에서 사용할 수 없습니다.

---

## 0. 어트리뷰트 기본 개념

### 0-1. 어트리뷰트란?

C#에서 어트리뷰트는 클래스, 필드, 메서드, 프로퍼티, 어셈블리 등에 붙이는 “메타데이터”입니다.

Unity에서는 이 메타데이터를 읽어서 다음과 같은 일을 합니다.

- Inspector 표시 방식 변경
- private 필드 직렬화
- 메뉴 항목 생성
- ScriptableObject 생성 메뉴 등록
- 커스텀 에디터 연결
- 빌드 전후 콜백 등록
- Play Mode, Domain Reload 시점 콜백 실행
- 테스트 메서드 인식
- 코드 스트리핑 방지
- 커스텀 UI Toolkit 요소 노출

예시:

```csharp
[SerializeField]
private int hp;

[System.Serializable]
public class ItemData
{
    public string itemName;
}

[MenuItem("Combat/Setup Animated Agent Prefabs")]
private static void SetupPrefabs()
{
    Debug.Log("Setup!");
}
```

### 0-2. `Attribute` 접미사는 생략 가능

아래 둘은 같은 의미입니다.

```csharp
[System.Serializable]
public class A {}

[System.SerializableAttribute]
public class B {}
```

직접 어트리뷰트를 만들 때 클래스명은 관례적으로 `SomethingAttribute`라고 짓고, 사용할 때는 `[Something]`처럼 씁니다.

### 0-3. 여러 개를 붙이는 방식

아래 두 방식 모두 가능합니다.

```csharp
[SerializeField]
[Range(0, 100)]
private int hp;
```

```csharp
[SerializeField, Range(0, 100)]
private int hp;
```

실무에서는 줄마다 하나씩 쓰는 방식이 읽기 쉽습니다.

---

## 1. 빠른 분류표

| 분류 | 대표 어트리뷰트 | 주 용도 |
|---|---|---|
| Inspector 노출/표시 | `[SerializeField]`, `[HideInInspector]`, `[Header]`, `[Tooltip]`, `[Range]`, `[TextArea]` | 인스펙터에 어떻게 보일지 제어 |
| Unity 직렬화 | `[System.Serializable]`, `[SerializeReference]`, `[FormerlySerializedAs]`, `[NonSerialized]` | 씬, 프리팹, ScriptableObject에 데이터 저장 |
| 컴포넌트 제약 | `[RequireComponent]`, `[DisallowMultipleComponent]`, `[AddComponentMenu]` | 컴포넌트 추가/중복/메뉴 위치 제어 |
| 실행 시점 | `[DefaultExecutionOrder]`, `[ExecuteAlways]`, `[RuntimeInitializeOnLoadMethod]` | 실행 순서와 초기화 시점 제어 |
| 에디터 메뉴/툴 | `[MenuItem]`, `[ContextMenu]`, `[DrawGizmo]`, `[EditorTool]`, `[Shortcut]` | 에디터 기능 확장 |
| 커스텀 인스펙터 | `[CustomEditor]`, `[CustomPropertyDrawer]`, `[CanEditMultipleObjects]` | Inspector UI 직접 커스터마이즈 |
| ScriptableObject | `[CreateAssetMenu]` | Assets/Create 메뉴에 에셋 생성 항목 등록 |
| UI Toolkit | `[UxmlElement]`, `[UxmlAttribute]`, `[UxmlObject]` | 커스텀 VisualElement를 UXML/UI Builder에 노출 |
| 빌드/임포트 콜백 | `[PostProcessBuild]`, `[PostProcessScene]`, `[ScriptedImporter]`, `[OnOpenAsset]` | 빌드, 씬 처리, 에셋 임포트 확장 |
| 테스트 | `[Test]`, `[UnityTest]`, `[SetUp]`, `[TearDown]`, `[Category]` | Unity Test Framework/NUnit 테스트 정의 |
| C# 기본 | `[Obsolete]`, `[Flags]`, `[DllImport]`, `[AttributeUsage]`, `[Conditional]` | 컴파일러, 런타임, 네이티브 연동 제어 |

---

## 2. UnityEngine: Inspector와 직렬화 관련

이 영역은 Unity 초반에 가장 자주 만나는 어트리뷰트입니다.

### 2-1. `[SerializeField]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | 필드 |
| 핵심 | private/protected 필드를 Unity 직렬화 대상으로 만들고 Inspector에 표시 |
| 자주 쓰는 상황 | 캡슐화는 유지하면서 Inspector에서 값 조정이 필요할 때 |

```csharp
public class PlayerHealth : MonoBehaviour
{
    [SerializeField]
    private int maxHp = 100;
}
```

주의점:

- 프로퍼티가 아니라 필드에 붙입니다.
- Unity의 직렬화 시스템은 .NET 직렬화와 다릅니다.
- `Dictionary`, 일반 인터페이스 필드, 대부분의 제네릭 타입은 Unity 기본 직렬화에서 제한이 있습니다.

---

### 2-2. `[HideInInspector]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | 필드 |
| 핵심 | public 필드라도 Inspector에서 숨김 |
| 자주 쓰는 상황 | 코드에서는 public 접근이 필요하지만 Inspector에는 노출하고 싶지 않을 때 |

```csharp
[HideInInspector]
public int runtimeScore;
```

주의점:

- 숨길 뿐, public 필드 자체가 직렬화 대상인 점은 상황에 따라 유지될 수 있습니다.
- Inspector에 보이지 않으므로 디버깅 편의성은 떨어질 수 있습니다.

---

### 2-3. `[System.Serializable]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `System` |
| 붙이는 위치 | class, struct, enum 등 타입 |
| 핵심 | Unity가 사용자 정의 class/struct의 필드를 Inspector와 직렬화 대상으로 다룰 수 있게 함 |
| 자주 쓰는 상황 | `ItemData`, `StatData`, `InventorySlot` 같은 데이터 클래스를 MonoBehaviour 안에 넣을 때 |

```csharp
[System.Serializable]
public class ItemData
{
    public string itemName;
    public int count;
}

public class Inventory : MonoBehaviour
{
    [SerializeField]
    private ItemData startItem;
}
```

주의점:

- Unity에서 `MonoBehaviour`, `ScriptableObject`는 이미 Unity 객체 계층에 속하므로 보통 `[System.Serializable]`을 붙이지 않습니다.
- `System.Serializable`은 C#/.NET의 어트리뷰트지만 Unity 직렬화에서도 사용자 정의 데이터 타입 표시를 위해 자주 씁니다.

---

### 2-4. `[NonSerialized]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `System` |
| 붙이는 위치 | 필드 |
| 핵심 | 직렬화 가능한 타입 안에서 특정 필드를 직렬화하지 않음 |
| 자주 쓰는 상황 | 런타임 캐시, 계산으로 다시 만들 수 있는 값, 저장되면 안 되는 임시 값 |

```csharp
[System.NonSerialized]
public int runtimeOnlyCache;
```

주의점:

- private 필드는 기본적으로 Unity Inspector에 직렬화되지 않으므로 보통 public 필드를 제외할 때 더 자주 보입니다.
- Unity 직렬화와 .NET 직렬화의 동작 차이를 구분해야 합니다.

---

### 2-5. `[SerializeReference]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | 필드 |
| 핵심 | 사용자 정의 class를 값 복사가 아니라 참조 기반으로 직렬화 |
| 자주 쓰는 상황 | 다형성, 인터페이스/추상 클래스 기반 데이터, null 보존, 그래프/트리 구조 저장 |

```csharp
[System.Serializable]
public abstract class SkillEffect
{
    public string effectName;
}

[System.Serializable]
public class DamageEffect : SkillEffect
{
    public int damage;
}

public class SkillData : MonoBehaviour
{
    [SerializeReference]
    private SkillEffect effect;
}
```

주의점:

- 대상 인스턴스 타입도 `[System.Serializable]`이어야 합니다.
- `UnityEngine.Object`를 상속한 타입에는 쓰지 않습니다. 예: `GameObject`, `MonoBehaviour`, `ScriptableObject`.
- 일반 직렬화보다 저장, 로딩, 관리 비용이 커질 수 있습니다.
- Inspector에서 파생 타입 선택 UI가 기본으로 충분하지 않아 커스텀 drawer나 별도 툴을 붙이는 경우가 많습니다.

---

### 2-6. `[FormerlySerializedAs]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine.Serialization` |
| 붙이는 위치 | 필드 |
| 핵심 | 필드명을 바꿔도 기존 씬/프리팹/에셋에 저장된 값을 잃지 않도록 이전 이름을 알려줌 |
| 자주 쓰는 상황 | `hitpoints`를 `health`로 바꾸는 리팩토링 |

```csharp
using UnityEngine.Serialization;

public class Enemy : MonoBehaviour
{
    [FormerlySerializedAs("hitpoints")]
    [SerializeField]
    private int health;
}
```

주의점:

- 필드명을 바꿀 때 매우 중요합니다.
- 팀 프로젝트에서 씬/프리팹 데이터 손실을 막는 습관으로 쓰기 좋습니다.
- 여러 번 이름을 바꿨다면 체인처럼 여러 개를 붙일 수 있습니다.

```csharp
[FormerlySerializedAs("hp")]
[FormerlySerializedAs("hitpoints")]
[SerializeField]
private int health;
```

---

## 3. UnityEngine: Inspector 표시 보조 어트리뷰트

이들은 대부분 `PropertyAttribute` 계열입니다. 즉, 필드의 Inspector 표시 방식을 바꿉니다.

### 3-1. 자주 쓰는 표시 어트리뷰트 표

| 어트리뷰트 | 붙이는 위치 | 설명 | 예시 |
|---|---:|---|---|
| `[Header("...")]` | 필드 | Inspector에 섹션 제목 표시 | `[Header("Health")]` |
| `[Tooltip("...")]` | 필드 | 마우스 hover 시 설명 표시 | `[Tooltip("최대 체력")]` |
| `[Space]` | 필드 | Inspector에 여백 추가 | `[Space(10)]` |
| `[Range(min, max)]` | int/float 필드 | 슬라이더로 표시 | `[Range(0, 100)]` |
| `[Min(value)]` | int/float 필드 | 최소값 제한 | `[Min(0)]` |
| `[Multiline]` | string 필드 | 여러 줄 입력칸 | `[Multiline(3)]` |
| `[TextArea]` | string 필드 | 긴 텍스트 입력칸 | `[TextArea(3, 10)]` |
| `[Delayed]` | int/float/string 필드 | 입력 즉시 반영하지 않고 Enter 또는 포커스 해제 시 반영 | `[Delayed]` |
| `[ColorUsage]` | Color 필드 | HDR/알파 등 컬러 선택 옵션 제어 | `[ColorUsage(true, true)]` |
| `[GradientUsage]` | Gradient 필드 | Gradient 사용 방식 제어 | `[GradientUsage(true)]` |
| `[InspectorName("...")]` | 필드/enum 값 | Inspector에 표시되는 이름 변경 | `[InspectorName("이동 속도")]` |
| `[ContextMenuItem]` | 필드 | 필드 우클릭 메뉴 추가 | `[ContextMenuItem("Reset", "ResetValue")]` |
| `[NonReorderable]` | 배열/List 필드 | Inspector에서 배열/List 순서 변경 UI 제한 | `[NonReorderable]` |

예시:

```csharp
public class WeaponConfig : MonoBehaviour
{
    [Header("Damage")]
    [SerializeField, Min(0)]
    private int damage = 10;

    [Header("UI")]
    [SerializeField, Tooltip("플레이어에게 표시할 무기 설명")]
    [TextArea(3, 8)]
    private string description;

    [SerializeField, Range(0f, 1f)]
    private float criticalChance = 0.1f;
}
```

---

### 3-2. `[Range]`와 `[Min]`의 차이

```csharp
[Range(0, 100)]
public int hp;

[Min(0)]
public int gold;
```

- `[Range]`: Inspector에서 슬라이더로 표시합니다.
- `[Min]`: 최소값만 제한합니다. 최대값이 없는 값에 적합합니다.
- 둘 다 런타임 검증 로직을 대체하지는 않습니다. 코드에서 값을 넣으면 별도 검증이 필요할 수 있습니다.

---

### 3-3. `[ContextMenuItem]`

필드 우클릭 메뉴에 액션을 추가합니다.

```csharp
public class ItemIdGenerator : MonoBehaviour
{
    [ContextMenuItem("Generate ID", nameof(GenerateId))]
    [SerializeField]
    private string itemId;

    private void GenerateId()
    {
        itemId = System.Guid.NewGuid().ToString();
    }
}
```

---

## 4. UnityEngine: 컴포넌트와 GameObject 관련

### 4-1. `[RequireComponent]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | `MonoBehaviour` 클래스 |
| 핵심 | 이 스크립트가 붙을 때 필요한 컴포넌트를 자동으로 같이 추가 |
| 자주 쓰는 상황 | Rigidbody, Collider, Animator, AudioSource 등이 필수일 때 |

```csharp
[RequireComponent(typeof(Rigidbody))]
public class PlayerMovement : MonoBehaviour
{
    private Rigidbody rb;

    private void Awake()
    {
        rb = GetComponent<Rigidbody>();
    }
}
```

여러 개도 가능합니다.

```csharp
[RequireComponent(typeof(Rigidbody), typeof(CapsuleCollider))]
public class CharacterMotor : MonoBehaviour
{
}
```

주의점:

- 이미 붙어 있는 오래된 GameObject에 자동 소급 적용되는 것은 아닙니다.
- 스크립트를 추가하는 시점에 누락 컴포넌트를 추가해주는 용도에 가깝습니다.

---

### 4-2. `[DisallowMultipleComponent]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | `MonoBehaviour` 클래스 |
| 핵심 | 같은 GameObject에 같은 컴포넌트가 여러 개 붙는 것을 막음 |

```csharp
[DisallowMultipleComponent]
public class PlayerController : MonoBehaviour
{
}
```

---

### 4-3. `[AddComponentMenu]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | `MonoBehaviour` 클래스 |
| 핵심 | Add Component 메뉴에서 보이는 경로를 지정 |
| 자주 쓰는 상황 | 직접 만든 컴포넌트를 카테고리별로 정리하고 싶을 때 |

```csharp
[AddComponentMenu("Combat/Enemy AI Controller")]
public class EnemyAIController : MonoBehaviour
{
}
```

---

### 4-4. `[HelpURL]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | 클래스 |
| 핵심 | Inspector 상단 도움말 버튼을 눌렀을 때 이동할 문서 URL 지정 |

```csharp
[HelpURL("https://example.com/docs/enemy-ai")]
public class EnemyAIController : MonoBehaviour
{
}
```

팀 프로젝트에서 “이 컴포넌트는 어떤 규칙으로 써야 하는지” 문서와 연결할 때 좋습니다.

---

### 4-5. `[SelectionBase]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | 클래스 |
| 핵심 | Scene View에서 하위 오브젝트를 클릭해도 이 컴포넌트가 붙은 GameObject를 선택 기준으로 삼도록 함 |

```csharp
[SelectionBase]
public class BuildingRoot : MonoBehaviour
{
}
```

복잡한 프리팹, 캐릭터, 건물처럼 하위 Mesh가 많을 때 유용합니다.

---

### 4-6. `[Icon]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | `MonoBehaviour`, `ScriptableObject` 클래스 |
| 핵심 | 스크립트/컴포넌트에 프로젝트 내 아이콘 텍스처 지정 |

```csharp
[Icon("Assets/Editor/Icons/EnemyIcon.png")]
public class EnemyAIController : MonoBehaviour
{
}
```

---

### 4-7. `[ExcludeFromPreset]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | 클래스 |
| 핵심 | 해당 타입 인스턴스로 Preset을 만들지 못하게 함 |

```csharp
[ExcludeFromPreset]
public class RuntimeOnlyComponent : MonoBehaviour
{
}
```

---

### 4-8. `[ExcludeFromObjectFactory]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | 클래스 |
| 핵심 | ObjectFactory를 통한 생성 대상에서 제외 |
| 자주 쓰는 상황 | 에디터 확장이나 내부 도구에서 생성되면 안 되는 타입 보호 |

```csharp
[ExcludeFromObjectFactory]
public class InternalOnlyComponent : MonoBehaviour
{
}
```

---

## 5. UnityEngine: 실행 시점과 초기화 관련

### 5-1. `[DefaultExecutionOrder]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | `MonoBehaviour` 클래스 |
| 핵심 | Script Execution Order를 코드에서 지정 |
| 값 의미 | 작은 값일수록 먼저 실행, 큰 값일수록 나중 실행 |

```csharp
[DefaultExecutionOrder(-100)]
public class GameBootstrapper : MonoBehaviour
{
    private void Awake()
    {
        Debug.Log("다른 일반 스크립트보다 먼저 초기화");
    }
}
```

주의점:

- Project Settings의 Script Execution Order와 함께 쓰면 헷갈릴 수 있습니다.
- 남용하면 실행 흐름 추적이 어려워집니다.
- 부트스트랩, 전역 초기화, 입력 시스템 초기화처럼 명확한 이유가 있을 때만 쓰는 편이 좋습니다.

---

### 5-2. `[ExecuteAlways]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | `MonoBehaviour` 클래스 |
| 핵심 | Play Mode가 아니어도 Edit Mode에서 스크립트 콜백 실행 |
| 자주 쓰는 상황 | 에디터에서 배치 미리보기, 자동 정렬, Gizmo 갱신, 데이터 검증 |

```csharp
[ExecuteAlways]
public class LookAtCameraPreview : MonoBehaviour
{
    private void Update()
    {
        if (!Application.isPlaying)
        {
            // Edit Mode 전용 미리보기 로직
        }
    }
}
```

주의점:

- Edit Mode에서 씬 데이터가 의도치 않게 변경될 수 있습니다.
- `Application.isPlaying` 체크를 습관화하는 것이 좋습니다.

---

### 5-3. `[ExecuteInEditMode]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | `MonoBehaviour` 클래스 |
| 핵심 | 예전부터 쓰이던 Edit Mode 실행 어트리뷰트 |
| 현재 권장 | 새 코드에서는 보통 `[ExecuteAlways]` 사용을 우선 고려 |

```csharp
[ExecuteInEditMode]
public class LegacyEditModePreview : MonoBehaviour
{
}
```

---

### 5-4. `[RuntimeInitializeOnLoadMethod]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | static 메서드 |
| 핵심 | 씬 로드 전후, 서브시스템 등록 시점 등에 자동 실행 |
| 자주 쓰는 상황 | 매니저 초기화, 정적 캐시 리셋, 런타임 부트스트랩 |

```csharp
public static class GameRuntimeBootstrap
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    private static void InitBeforeSceneLoad()
    {
        Debug.Log("첫 씬 로드 전에 실행");
    }
}
```

대표 `RuntimeInitializeLoadType`:

| 값 | 의미 |
|---|---|
| `BeforeSceneLoad` | 첫 씬 로드 전 |
| `AfterSceneLoad` | 첫 씬 로드 후 |
| `SubsystemRegistration` | 서브시스템 등록 시점 |
| `AfterAssembliesLoaded` | 어셈블리 로드 후 |
| `BeforeSplashScreen` | 스플래시 화면 전 |

주의점:

- 실행 순서를 과도하게 의존하면 유지보수가 어려워집니다.
- 씬 오브젝트 참조가 필요한 경우 실행 시점에 해당 오브젝트가 존재하는지 확인해야 합니다.

---

### 5-5. `[BeforeRenderOrder]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | 메서드 |
| 핵심 | 렌더 직전 콜백 순서 제어 용도 |
| 자주 쓰는 상황 | XR, 카메라, 렌더 직전 업데이트처럼 프레임 타이밍이 민감한 코드 |

일반 게임 로직에서는 자주 쓰지 않습니다.

---

## 6. UnityEngine: ScriptableObject와 에셋 생성

### 6-1. `[CreateAssetMenu]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | `ScriptableObject` 파생 클래스 |
| 핵심 | Assets/Create 메뉴에 ScriptableObject 생성 항목 등록 |

```csharp
[CreateAssetMenu(
    fileName = "New Item Data",
    menuName = "Game Data/Item Data",
    order = 0)]
public class ItemData : ScriptableObject
{
    public string itemName;
    public Sprite icon;
}
```

파라미터:

| 파라미터 | 의미 |
|---|---|
| `fileName` | 생성 시 기본 파일명 |
| `menuName` | Assets/Create 아래 메뉴 경로 |
| `order` | 메뉴 표시 순서 |

자주 쓰는 구조:

```text
Assets
└─ Create
   └─ Game Data
      ├─ Item Data
      ├─ Enemy Data
      └─ Skill Data
```

---

## 7. UnityEngine: 렌더링, 이미지 이펙트, 시각화 관련

| 어트리뷰트 | 위치 | 설명 | 비고 |
|---|---:|---|---|
| `[ImageEffectAllowedInSceneView]` | 이미지 이펙트 컴포넌트 | Scene View에서도 이미지 이펙트 허용 | Built-in/레거시 이미지 이펙트에서 주로 등장 |
| `[ImageEffectOpaque]` | 이미지 이펙트 메서드/컴포넌트 | 불투명 렌더링 이후 이펙트 처리 | 렌더 파이프라인에 따라 사용성 차이 |
| `[ImageEffectTransformsToLDR]` | 이미지 이펙트 | HDR에서 LDR로 변환하는 이펙트 표시 | 레거시 후처리 코드에서 볼 수 있음 |
| `[ColorUsage]` | Color 필드 | HDR 컬러, 알파 표시 제어 | Inspector 표시 보조 |
| `[GradientUsage]` | Gradient 필드 | HDR Gradient 사용 제어 | Inspector 표시 보조 |
| `[GUITarget]` | IMGUI 메서드 | 특정 디스플레이 대상으로 GUI 렌더링 | 일반 게임 로직에서는 드묾 |

요즘 프로젝트에서는 URP/HDRP의 Volume, Renderer Feature, Shader Graph, Custom Pass 등으로 후처리를 구성하는 경우가 많아 일부 이미지 이펙트 어트리뷰트는 오래된 예제에서 더 자주 보입니다.

---

## 8. UnityEngine.Scripting: 코드 스트리핑과 Unity 내부 연동

### 8-1. `[Preserve]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine.Scripting` |
| 붙이는 위치 | 클래스, 메서드, 필드, 프로퍼티 등 |
| 핵심 | Managed code stripping에서 제거되지 않도록 보존 |
| 자주 쓰는 상황 | 리플렉션으로 호출되는 타입/메서드, JSON 역직렬화로 생성되는 타입, IL2CPP 빌드에서 참조가 안 보이는 코드 |

```csharp
using UnityEngine.Scripting;

[Preserve]
public class ReflectedCommand
{
    [Preserve]
    public void Execute()
    {
    }
}
```

주의점:

- 무분별하게 붙이면 빌드 크기 최적화 효과가 줄어듭니다.
- 대규모 보존은 `link.xml`이 더 관리하기 좋을 수 있습니다.

---

### 8-2. Unity 내부/네이티브 바인딩 계열

다음 어트리뷰트들은 Unity 내부 코드, 네이티브 바인딩, 패키지 내부 구현에서 보이는 경우가 많습니다. 일반 게임 코드에서 직접 사용할 일은 적습니다.

| 어트리뷰트 | 설명 |
|---|---|
| `[UsedByNativeCode]` | 네이티브 코드에서 사용됨을 표시 |
| `[RequiredByNativeCode]` | 네이티브 코드가 필요로 하는 타입/멤버 표시 |
| `[NativeHeader]` | 연결되는 네이티브 헤더 정보 |
| `[NativeName]` | 네이티브 쪽 이름 매핑 |
| `[NativeMethod]` | 네이티브 메서드 매핑 |
| `[NativeProperty]` | 네이티브 프로퍼티 매핑 |
| `[NativeThrows]` | 네이티브 예외 관련 표시 |
| `[VisibleToOtherModules]` | Unity 모듈 간 노출 정보 |
| `[MovedFrom]` | 타입/네임스페이스 이동 정보 |
| `[FreeFunction]` | 네이티브 free function 매핑 |
| `[StaticAccessor]` | 네이티브 static 접근자 매핑 |
| `[ThreadSafe]` | 네이티브 호출 thread-safe 정보 |
| `[NativeConditional]` | 네이티브 조건부 컴파일 정보 |

요약하면, Unity 소스나 패키지 내부 구현을 읽다가 보이면 “엔진과 C# API를 연결하기 위한 표시”로 이해하면 됩니다.

---

## 9. UnityEditor: 메뉴, 에디터 콜백, 에디터 확장

`UnityEditor` 네임스페이스는 에디터 전용입니다. 일반적으로 `Assets/Editor` 폴더 안에 넣거나, Assembly Definition에서 Editor 전용 어셈블리로 분리합니다.

### 9-1. `[MenuItem]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | static 메서드 |
| 핵심 | Unity 상단 메뉴, Assets 우클릭 메뉴, GameObject 메뉴 등에 항목 추가 |
| 메서드 조건 | static 메서드여야 함 |

```csharp
using UnityEditor;
using UnityEngine;

public static class CombatMenu
{
    [MenuItem("Combat/Setup Animated Agent Prefabs")]
    private static void SetupAnimatedAgentPrefabs()
    {
        Debug.Log("프리팹 세팅 실행");
    }
}
```

#### 메뉴 검증 함수

같은 경로에 `true`를 두 번째 인자로 넣으면 해당 메뉴가 활성화 가능한지 검사합니다.

```csharp
public static class SelectionMenu
{
    [MenuItem("Tools/Print Selected Name")]
    private static void PrintSelectedName()
    {
        Debug.Log(Selection.activeGameObject.name);
    }

    [MenuItem("Tools/Print Selected Name", true)]
    private static bool ValidatePrintSelectedName()
    {
        return Selection.activeGameObject != null;
    }
}
```

#### 단축키 표기

| 기호 | 의미 |
|---|---|
| `%` | Windows/Linux: Ctrl, macOS: Cmd |
| `^` | Ctrl |
| `#` | Shift |
| `&` | Alt |
| `_g` | 단일 키 G |

```csharp
[MenuItem("Tools/Do Something #&g")]
private static void DoSomething()
{
}
```

위 예시는 Shift + Alt + G입니다.

---

### 9-2. `[ContextMenu]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine` |
| 붙이는 위치 | 인스턴스 메서드 |
| 핵심 | 컴포넌트 Inspector 우클릭 메뉴에 실행 항목 추가 |
| 자주 쓰는 상황 | 디버그, 자동 세팅, 데이터 초기화 |

```csharp
public class EnemySpawner : MonoBehaviour
{
    [ContextMenu("Spawn Test Enemy")]
    private void SpawnTestEnemy()
    {
        Debug.Log("테스트 적 생성");
    }
}
```

주의점:

- 에디터에서 버튼처럼 쓸 수 있어 편하지만, 반복적으로 쓸 도구라면 CustomEditor 버튼이 더 명확할 수 있습니다.

---

### 9-3. `[InitializeOnLoad]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | 클래스 |
| 핵심 | Unity 에디터 로드 또는 스크립트 재컴파일 시 static 생성자 실행 |

```csharp
using UnityEditor;
using UnityEngine;

[InitializeOnLoad]
public static class EditorBoot
{
    static EditorBoot()
    {
        Debug.Log("에디터 로드 또는 스크립트 리로드 시 실행");
    }
}
```

주의점:

- 에셋 로딩이 아직 끝나지 않은 시점일 수 있습니다.
- 에셋 접근이 필요하면 `AssetPostprocessor.OnPostprocessAllAssets`나 지연 호출을 고려합니다.

---

### 9-4. `[InitializeOnLoadMethod]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | static 메서드 |
| 핵심 | 클래스 static 생성자 없이 메서드 단위로 에디터 로드 시 실행 |

```csharp
public static class EditorInitMethod
{
    [InitializeOnLoadMethod]
    private static void Init()
    {
        Debug.Log("에디터 로드 시 메서드 실행");
    }
}
```

---

### 9-5. `[InitializeOnEnterPlayMode]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | static 메서드 |
| 핵심 | Play Mode 진입 시점에 실행 |
| 자주 쓰는 상황 | Domain Reload 비활성화 환경에서 정적 캐시 초기화 |

```csharp
using UnityEditor;

public static class PlayModeReset
{
    [InitializeOnEnterPlayMode]
    private static void ResetOnEnterPlayMode(EnterPlayModeOptions options)
    {
        // static cache reset
    }
}
```

---

### 9-6. `[DidReloadScripts]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor.Callbacks` |
| 붙이는 위치 | static 메서드 |
| 핵심 | 스크립트 리로드 후 콜백 실행 |
| 특징 | callback order 지정 가능 |

```csharp
using UnityEditor.Callbacks;
using UnityEngine;

public static class ReloadCallback
{
    [DidReloadScripts]
    private static void OnScriptsReloaded()
    {
        Debug.Log("스크립트 리로드 완료");
    }
}
```

---

### 9-7. `[PostProcessBuild]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor.Callbacks` |
| 붙이는 위치 | static 메서드 |
| 핵심 | 플레이어 빌드 직후 실행 |
| 자주 쓰는 상황 | 빌드 산출물 복사, iOS Xcode 프로젝트 수정, 빌드 후 파일 생성 |

```csharp
using UnityEditor;
using UnityEditor.Callbacks;

public static class BuildPostProcessor
{
    [PostProcessBuild]
    private static void OnPostProcessBuild(BuildTarget target, string pathToBuiltProject)
    {
        UnityEngine.Debug.Log($"Build finished: {target}, {pathToBuiltProject}");
    }
}
```

---

### 9-8. `[PostProcessScene]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor.Callbacks` |
| 붙이는 위치 | static 메서드 |
| 핵심 | 씬이 빌드 처리된 직후 실행 |
| 자주 쓰는 상황 | 빌드 전용 씬 데이터 변환, 검증, 자동 세팅 |

```csharp
using UnityEditor.Callbacks;
using UnityEngine;

public static class ScenePostProcessor
{
    [PostProcessScene]
    private static void OnPostProcessScene()
    {
        Debug.Log("씬 후처리");
    }
}
```

---

### 9-9. `[OnOpenAsset]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor.Callbacks` |
| 붙이는 위치 | static 메서드 |
| 핵심 | 에디터에서 에셋을 열려고 할 때 커스텀 처리 |
| 자주 쓰는 상황 | 특정 커스텀 에셋을 더블클릭하면 자체 에디터 창 열기 |

```csharp
using UnityEditor.Callbacks;

public static class OpenAssetHandler
{
    [OnOpenAsset]
    private static bool OnOpenAsset(int instanceID, int line)
    {
        // true를 반환하면 Unity의 기본 열기 동작을 막고 직접 처리했다는 뜻
        return false;
    }
}
```

---

### 9-10. `[DrawGizmo]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | static 메서드 |
| 핵심 | 특정 컴포넌트에 대한 Gizmo 렌더링을 외부 클래스에서 정의 |

```csharp
using UnityEditor;
using UnityEngine;

public class PatrolPoint : MonoBehaviour
{
    public float radius = 1f;
}

public static class PatrolPointGizmoDrawer
{
    [DrawGizmo(GizmoType.Selected | GizmoType.NonSelected)]
    private static void DrawPatrolPointGizmo(PatrolPoint point, GizmoType gizmoType)
    {
        Gizmos.DrawWireSphere(point.transform.position, point.radius);
    }
}
```

---

## 10. UnityEditor: Custom Inspector와 Property Drawer

### 10-1. `[CustomEditor]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | `Editor` 파생 클래스 |
| 핵심 | 특정 타입의 Inspector를 직접 그림 |

```csharp
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(EnemySpawner))]
public class EnemySpawnerEditor : Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();

        var spawner = (EnemySpawner)target;

        if (GUILayout.Button("Spawn Test Enemy"))
        {
            // spawner.Spawn...
        }
    }
}
```

---

### 10-2. `[CanEditMultipleObjects]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | `Editor` 파생 클래스 |
| 핵심 | 여러 오브젝트를 동시에 선택했을 때 커스텀 에디터가 다중 편집을 지원한다고 표시 |

```csharp
[CustomEditor(typeof(EnemySpawner))]
[CanEditMultipleObjects]
public class EnemySpawnerEditor : Editor
{
}
```

주의점:

- `target` 하나만 수정하면 다중 편집이 깨질 수 있습니다.
- `serializedObject`, `SerializedProperty`를 사용하는 방식이 다중 편집에 적합합니다.

---

### 10-3. `[CustomPropertyDrawer]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | `PropertyDrawer` 또는 `DecoratorDrawer` 파생 클래스 |
| 핵심 | 특정 serializable class 또는 custom PropertyAttribute의 Inspector 표시 방식 정의 |

#### Serializable class에 drawer 붙이기

```csharp
[System.Serializable]
public class Stat
{
    public string name;
    public int value;
}
```

```csharp
using UnityEditor;
using UnityEngine;

[CustomPropertyDrawer(typeof(Stat))]
public class StatDrawer : PropertyDrawer
{
    public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
    {
        EditorGUI.PropertyField(position, property, label, true);
    }
}
```

#### 직접 만든 어트리뷰트에 drawer 붙이기

```csharp
using UnityEngine;

public class ReadOnlyAttribute : PropertyAttribute
{
}
```

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

```csharp
[ReadOnly]
[SerializeField]
private int generatedId;
```

---

### 10-4. `[CustomPreview]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | `ObjectPreview` 파생 클래스 |
| 핵심 | Inspector Preview 영역을 커스터마이즈 |

```csharp
[CustomPreview(typeof(Texture2D))]
public class MyTexturePreview : ObjectPreview
{
}
```

실무에서는 일반 Inspector 커스터마이즈보다 사용 빈도가 낮지만, 에셋 프리뷰 도구를 만들 때 유용합니다.

---

### 10-5. `[EditorWindowTitle]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | `EditorWindow` 파생 클래스 |
| 핵심 | EditorWindow의 제목과 아이콘 지정 |

```csharp
using UnityEditor;

[EditorWindowTitle(title = "Combat Tool")]
public class CombatToolWindow : EditorWindow
{
}
```

---

## 11. UnityEditor: 툴바, 단축키, EditorTool

### 11-1. `[Shortcut]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor.ShortcutManagement` |
| 붙이는 위치 | static 메서드 |
| 핵심 | Shortcut Manager에 단축키 등록 |
| 메서드 조건 | 인자 없음 또는 `ShortcutArguments` 하나 |

```csharp
using UnityEditor.ShortcutManagement;
using UnityEngine;

public static class MyShortcuts
{
    [Shortcut("My Tools/Log Hello")]
    private static void LogHello()
    {
        Debug.Log("Hello");
    }
}
```

---

### 11-2. `[ClutchShortcut]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor.ShortcutManagement` |
| 붙이는 위치 | static 메서드 |
| 핵심 | 누르고 있는 동안 동작하는 clutch 방식 단축키 |
| 자주 쓰는 상황 | 임시 도구 활성화, Scene View 도구 전환 |

---

### 11-3. `[EditorTool]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor.EditorTools` |
| 붙이는 위치 | `EditorTool` 파생 클래스 |
| 핵심 | Scene View 커스텀 툴 등록 |

```csharp
using UnityEditor.EditorTools;
using UnityEngine;

[EditorTool("Patrol Point Tool", typeof(PatrolPoint))]
public class PatrolPointTool : EditorTool
{
    public override void OnToolGUI(EditorWindow window)
    {
        // Scene View tool GUI
    }
}
```

---

### 11-4. `[EditorToolContext]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor.EditorTools` |
| 붙이는 위치 | `EditorToolContext` 파생 클래스 |
| 핵심 | 커스텀 툴 컨텍스트 등록 |
| 자주 쓰는 상황 | 특정 타입/모드에서만 활성화되는 도구 환경 구성 |

---

### 11-5. `[EditorToolbarElement]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor.Toolbars` |
| 붙이는 위치 | Toolbar UI 요소 클래스 |
| 핵심 | Editor Toolbar/Overlay에서 사용할 VisualElement 등록 |

```csharp
using UnityEditor.Toolbars;
using UnityEngine.UIElements;

[EditorToolbarElement("MyTools/ExampleButton")]
public class ExampleToolbarButton : EditorToolbarButton
{
}
```

---

## 12. UnityEditor: Settings, Search, Asset Import, Build 확장

### 12-1. `[SettingsProvider]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | static 메서드 |
| 핵심 | Project Settings 또는 Preferences에 커스텀 설정 페이지 등록 |
| 메서드 반환 | `SettingsProvider` |

```csharp
using UnityEditor;

public static class MySettingsProvider
{
    [SettingsProvider]
    public static SettingsProvider CreateProvider()
    {
        return new SettingsProvider("Project/My Game Settings", SettingsScope.Project);
    }
}
```

---

### 12-2. `[SettingsProviderGroup]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | static 메서드 |
| 핵심 | 여러 SettingsProvider를 한 번에 등록 |

---

### 12-3. `[ScriptedImporter]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor.AssetImporters` |
| 붙이는 위치 | `ScriptedImporter` 파생 클래스 |
| 핵심 | 커스텀 파일 확장자를 Unity 에셋으로 임포트 |
| 자주 쓰는 상황 | `.csv`, `.bytes`, 자체 데이터 포맷, 레벨 데이터 임포터 |

```csharp
using UnityEditor.AssetImporters;
using UnityEngine;

[ScriptedImporter(1, "mydata")]
public class MyDataImporter : ScriptedImporter
{
    public override void OnImportAsset(AssetImportContext ctx)
    {
        var asset = ScriptableObject.CreateInstance<MyImportedData>();
        ctx.AddObjectToAsset("main", asset);
        ctx.SetMainObject(asset);
    }
}
```

---

### 12-4. `[AssetPostprocessorStaticVariableIgnore]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEditor` |
| 붙이는 위치 | `AssetPostprocessor`, `ScriptedImporter` 내부 static 변수 |
| 핵심 | Import Activity Window의 static variable warning에서 특정 변수를 제외 |
| 주의 | static 변수는 Asset Import Worker 도메인 차이 때문에 예상과 다르게 동작할 수 있음 |

---

### 12-5. Search 관련 어트리뷰트

Unity Search/Quick Search 확장에 사용하는 어트리뷰트입니다.

| 어트리뷰트 | 설명 |
|---|---|
| `[SearchItemProvider]` | 새 검색 provider 등록 |
| `[SearchActionsProvider]` | 검색 결과에 사용할 액션 등록 |
| `[SearchColumnProvider]` | 검색 테이블 컬럼 포맷 등록 |
| `[SearchExpressionEvaluator]` | Search Expression 함수 등록 |
| `[SearchExpressionEvaluatorSignatureOverload]` | Search Expression 시그니처 오버로드 |
| `[SearchSelector]` | Search item에서 값을 선택하는 방식 등록 |
| `[CustomObjectIndexer]` | 특정 타입에 대한 인덱싱 함수 등록 |

일반 게임플레이 코드보다 에디터 도구나 대규모 에셋 검색 도구에서 사용합니다.

---

### 12-6. Build/Profile/Profiler 관련 어트리뷰트

| 어트리뷰트 | 설명 |
|---|---|
| `[BuildCallbackVersion]` | 빌드 콜백 버전 정보 제공 |
| `[BuildProfileSettingsProvider]` | Build Profile 설정 섹션 등록 |
| `[ProfilerModuleMetadata]` | ProfilerModule의 이름, 아이콘 등 메타데이터 제공 |
| `[DiagnosticParameter]` | Project Auditor/Analyzer 계열 진단 파라미터 표시 |
| `[AdaptivePerformanceSupportedBuildTarget]` | Adaptive Performance provider가 지원하는 빌드 타겟 표시 |

---

### 12-7. Shader keyword filtering 관련 어트리뷰트

Unity 6 계열 API 목록에서 확인되는 Shader keyword filtering 관련 어트리뷰트입니다. Shader variant 빌드 포함/제외 규칙을 코드로 제어하는 데 사용됩니다.

| 어트리뷰트 | 설명 |
|---|---|
| `[Filter]` | shader keyword 포함/제거 규칙의 기반 |
| `[SelectIf]` | 조건이 맞으면 지정 keyword 포함 |
| `[SelectIfNot]` | 조건이 맞지 않으면 지정 keyword 포함 |
| `[SelectOrRemove]` | 조건 결과에 따라 keyword 포함 또는 제거 |
| `[GraphicsAPIConstraint]` | 그래픽스 API 조건 기반 |
| `[ApplyRulesIfGraphicsAPI]` | 특정 Graphics API일 때 규칙 적용 |
| `[ApplyRulesIfNotGraphicsAPI]` | 특정 Graphics API가 아닐 때 규칙 적용 |
| `[ApplyRulesIfTagsEqual]` | Shader tag가 같을 때 규칙 적용 |
| `[ApplyRulesIfTagsNotEqual]` | Shader tag가 다를 때 규칙 적용 |

이 영역은 일반적인 MonoBehaviour 개발보다 렌더링/빌드 최적화/셰이더 variant 관리 쪽에 가깝습니다.

---

## 13. UnityEditor 전체 목록에서 볼 수 있는 주요 Attribute 계열

UnityEditor API에는 일반 개발자가 자주 쓰는 것부터 내부 도구용에 가까운 것까지 매우 많습니다. 아래는 Unity 6.x API 목록에서 Attribute로 확인되는 것들을 공부용으로 묶은 표입니다.

| 어트리뷰트 | 대략적 용도 |
|---|---|
| `[AdvancedObjectSelector]` | 커스텀 advanced object selector 등록 |
| `[AdvancedObjectSelectorValidator]` | advanced object selector validator 등록 |
| `[AdaptivePerformanceSupportedBuildTarget]` | Adaptive Performance 지원 빌드 타겟 표시 |
| `[ApplyRulesIfGraphicsAPI]` | 그래픽스 API 조건에 따라 shader keyword 규칙 적용 |
| `[ApplyRulesIfNotGraphicsAPI]` | 특정 그래픽스 API가 아닐 때 shader keyword 규칙 적용 |
| `[ApplyRulesIfTagsEqual]` | shader tag 조건이 같을 때 규칙 적용 |
| `[ApplyRulesIfTagsNotEqual]` | shader tag 조건이 다를 때 규칙 적용 |
| `[AssetPostprocessorStaticVariableIgnore]` | AssetPostprocessor/ScriptedImporter static variable warning 제외 |
| `[BuildCallbackVersion]` | 빌드 콜백 버전 정보 |
| `[BuildProfileSettingsProvider]` | Build Profile 설정 Provider 등록 |
| `[CallbackOrder]` | 콜백 순서가 필요한 어트리뷰트의 기반 |
| `[CanEditMultipleObjects]` | 커스텀 에디터 다중 선택 편집 지원 |
| `[ClutchShortcut]` | 누르고 있는 동안 동작하는 단축키 등록 |
| `[CollectImportedDependencies]` | AssetDatabase import dependency 선언 |
| `[CustomEditor]` | 특정 타입의 Inspector 커스터마이즈 |
| `[CustomObjectIndexer]` | Unity Search 인덱싱 확장 |
| `[CustomPivot]` | 커스텀 pivot 모드/회전 등록 |
| `[CustomPreview]` | Inspector Preview 커스터마이즈 |
| `[CustomPropertyDrawer]` | Serializable 타입 또는 PropertyAttribute 표시 방식 커스터마이즈 |
| `[DeeplinkHandler]` | Unity Editor deeplink handler 등록 |
| `[DiagnosticParameter]` | Analyzer 진단 파라미터 표시 |
| `[DidReloadScripts]` | 스크립트 리로드 이후 콜백 |
| `[DiffuseProfileCallback]` | SRP 관련 importer callback |
| `[DrawGizmo]` | 컴포넌트별 Gizmo 렌더링 함수 등록 |
| `[EditorTool]` | Scene View 커스텀 도구 등록 |
| `[EditorToolContext]` | 커스텀 Tool Context 등록 |
| `[EditorToolbarElement]` | Toolbar/Overlay UI 요소 등록 |
| `[EditorWindowTitle]` | EditorWindow 제목/아이콘 지정 |
| `[FilePath]` | ScriptableSingleton 등의 저장 위치 지정 |
| `[Filter]` | shader keyword filtering 기반 |
| `[Graph]` | graph type 선언 |
| `[GraphicsAPIConstraint]` | graphics API 조건 지정 |
| `[InitializeOnEnterPlayMode]` | Play Mode 진입 시 실행 |
| `[InitializeOnLoad]` | 에디터 로드/스크립트 컴파일 후 클래스 초기화 |
| `[InitializeOnLoadMethod]` | 에디터 로드/스크립트 컴파일 후 메서드 실행 |
| `[LightingExplorerTab]` | Lighting Explorer 커스텀 탭 |
| `[LightingExplorerTableColumn]` | Lighting Explorer 컬럼 |
| `[MenuItem]` | 에디터 메뉴 항목 등록 |
| `[OnOpenAsset]` | 에셋 열기 시도 시 콜백 |
| `[PostProcessBuild]` | 빌드 후처리 콜백 |
| `[PostProcessScene]` | 씬 빌드 후처리 콜백 |
| `[ProfilerModuleMetadata]` | Profiler module 메타데이터 |
| `[ScriptedImporter]` | 커스텀 에셋 임포터 등록 |
| `[SearchActionsProvider]` | Search action provider 등록 |
| `[SearchColumnProvider]` | Search column provider 등록 |
| `[SearchExpressionEvaluator]` | Search expression evaluator 등록 |
| `[SearchExpressionEvaluatorSignatureOverload]` | Search expression evaluator 오버로드 |
| `[SearchItemProvider]` | Search item provider 등록 |
| `[SearchSelector]` | Search selector 등록 |
| `[SelectIf]` | 조건 기반 shader keyword 포함 |
| `[SelectIfNot]` | 조건 부정 기반 shader keyword 포함 |
| `[SelectOrRemove]` | shader keyword 포함/제거 조건 |
| `[SettingsProvider]` | Project Settings/Preferences 설정 페이지 등록 |
| `[SettingsProviderGroup]` | 여러 SettingsProvider 등록 |
| `[Shortcut]` | 단축키 등록 |
| `[UxmlNamespacePrefix]` | UXML namespace prefix 지정 |
| `[VersionControl]` | 버전 관리 시스템 객체 표시 |

---

## 14. UI Toolkit 관련 어트리뷰트

Unity 2023.2 이후/Unity 6 계열에서는 커스텀 UI Toolkit 요소를 UXML과 UI Builder에 노출하기 위한 어트리뷰트가 추가되어 있습니다.

### 14-1. `[UxmlElement]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine.UIElements` |
| 붙이는 위치 | `VisualElement` 파생 partial class |
| 핵심 | 커스텀 VisualElement를 UXML/UI Builder에 노출 |
| 조건 | `partial` 클래스여야 함 |

```csharp
using UnityEngine.UIElements;

[UxmlElement]
public partial class HealthBarElement : VisualElement
{
}
```

---

### 14-2. `[UxmlAttribute]`

| 항목 | 내용 |
|---|---|
| 네임스페이스 | `UnityEngine.UIElements` |
| 붙이는 위치 | 필드 또는 프로퍼티 |
| 핵심 | UXML에서 설정 가능한 속성으로 노출 |

```csharp
[UxmlElement]
public partial class HealthBarElement : VisualElement
{
    [UxmlAttribute]
    public int maxHp { get; set; }

    [UxmlAttribute]
    public string label { get; set; }
}
```

UXML 예시:

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <HealthBarElement max-hp="100" label="Player HP" />
</ui:UXML>
```

---

### 14-3. 기타 UXML 관련

| 어트리뷰트 | 설명 |
|---|---|
| `[UxmlObject]` | UXML에서 복합 객체 타입 선언 |
| `[UxmlObjectReference]` | UXML object 참조 필드/프로퍼티 지정 |
| `[UxmlTypeReference]` | UXML에서 특정 타입 참조 제한/지정 |
| `[UxmlCreateInstanceMethod]` | UxmlSerializedData의 기본 생성 방식을 대체할 메서드 지정 |
| `[UxmlNamespacePrefix]` | 어셈블리 단위로 UXML 네임스페이스 prefix 지정 |

---

## 15. Unity Test Framework / NUnit 어트리뷰트

Unity Test Framework는 NUnit 기반입니다. EditMode Test와 PlayMode Test에서 자주 씁니다.

### 15-1. 가장 자주 쓰는 테스트 어트리뷰트

| 어트리뷰트 | 설명 | 예시 |
|---|---|---|
| `[Test]` | 일반 동기 테스트 | 메서드가 void |
| `[UnityTest]` | 코루틴 테스트 | `IEnumerator` 반환 |
| `[SetUp]` | 각 테스트 전 실행 | 테스트별 초기화 |
| `[TearDown]` | 각 테스트 후 실행 | 테스트별 정리 |
| `[UnitySetUp]` | yield 가능한 테스트 전 초기화 | `IEnumerator` |
| `[UnityTearDown]` | yield 가능한 테스트 후 정리 | `IEnumerator` |
| `[OneTimeSetUp]` | fixture 전체에서 한 번 실행 | 전체 초기화 |
| `[OneTimeTearDown]` | fixture 전체 종료 후 한 번 실행 | 전체 정리 |
| `[TestFixture]` | 테스트 클래스 표시/파라미터화 | NUnit |
| `[Category]` | 테스트 카테고리 지정 | `[Category("Combat")]` |
| `[Ignore]` | 테스트 제외 | 사유 작성 권장 |
| `[Explicit]` | 명시 실행 시에만 실행 | 오래 걸리는 테스트 |
| `[Timeout]` | 제한 시간 지정 | ms 단위 |
| `[Retry]` | 실패 시 재시도 | PlayMode에서는 제한 주의 |
| `[Repeat]` | 반복 실행 | UnityTest와 조합 제한 |
| `[TestCase]` | 파라미터 테스트 | `[TestCase(1,2,3)]` |
| `[Values]` | 파라미터 값 목록 | `[Values(1,2,3)]` |
| `[ValueSource]` | 파라미터 소스 지정 | UnityTest 일부 지원 |
| `[Combinatorial]` | 파라미터 조합 테스트 | NUnit |
| `[Sequential]` | 파라미터 순차 조합 | NUnit |

---

### 15-2. `[Test]` 예시

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

---

### 15-3. `[UnityTest]` 예시

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

주의점:

- `[UnityTest]`는 `IEnumerator`를 반환합니다.
- 모든 NUnit 기능과 완전히 동일하게 조합되지는 않습니다.
- 파라미터화 테스트는 `[ValueSource]` 정도만 제한적으로 고려하는 편이 안전합니다.

---

## 16. C# / .NET 기본 어트리뷰트

Unity 스크립트에서도 C# 기본 어트리뷰트를 많이 사용합니다.

### 16-1. 자주 쓰는 C# 기본 어트리뷰트

| 어트리뷰트 | 네임스페이스 | 붙이는 위치 | 용도 |
|---|---|---:|---|
| `[Obsolete]` | `System` | 클래스/메서드/필드 등 | 더 이상 쓰지 말아야 하는 API 표시 |
| `[Flags]` | `System` | enum | 비트 플래그 enum 표시 |
| `[Serializable]` | `System` | class/struct | 직렬화 가능 타입 표시 |
| `[NonSerialized]` | `System` | field | 직렬화 제외 |
| `[AttributeUsage]` | `System` | Attribute class | 커스텀 어트리뷰트 사용 위치 제한 |
| `[Conditional]` | `System.Diagnostics` | method/attribute class | 특정 심볼이 있을 때만 호출 포함 |
| `[DebuggerDisplay]` | `System.Diagnostics` | class/struct | 디버거 표시 문자열 지정 |
| `[DebuggerStepThrough]` | `System.Diagnostics` | class/method | 디버거 step 진입 생략 |
| `[DllImport]` | `System.Runtime.InteropServices` | static extern method | 네이티브 DLL 함수 호출 |
| `[StructLayout]` | `System.Runtime.InteropServices` | class/struct | 메모리 배치 제어 |
| `[FieldOffset]` | `System.Runtime.InteropServices` | field | 명시적 필드 오프셋 지정 |
| `[MarshalAs]` | `System.Runtime.InteropServices` | field/parameter/return | interop marshaling 방식 지정 |
| `[MethodImpl]` | `System.Runtime.CompilerServices` | method/constructor | inline, synchronization 등 구현 옵션 지정 |
| `[CallerMemberName]` | `System.Runtime.CompilerServices` | optional parameter | 호출한 멤버 이름 자동 전달 |
| `[CallerFilePath]` | `System.Runtime.CompilerServices` | optional parameter | 호출한 소스 파일 경로 자동 전달 |
| `[CallerLineNumber]` | `System.Runtime.CompilerServices` | optional parameter | 호출한 라인 번호 자동 전달 |
| `[CallerArgumentExpression]` | `System.Runtime.CompilerServices` | optional parameter | 전달된 인자 표현식 문자열 자동 전달 |
| `[InternalsVisibleTo]` | `System.Runtime.CompilerServices` | assembly | internal 멤버를 특정 어셈블리에 공개 |
| `[AssemblyVersion]` | `System.Reflection` | assembly | 어셈블리 버전 지정 |
| `[AssemblyTitle]` | `System.Reflection` | assembly | 어셈블리 제목 지정 |

---

### 16-2. `[Obsolete]`

```csharp
[Obsolete("Use NewAttack() instead.")]
public void OldAttack()
{
}
```

컴파일 에러로 만들 수도 있습니다.

```csharp
[Obsolete("Use NewAttack() instead.", true)]
public void OldAttack()
{
}
```

---

### 16-3. `[Flags]`

```csharp
[System.Flags]
public enum DamageType
{
    None = 0,
    Fire = 1 << 0,
    Ice = 1 << 1,
    Poison = 1 << 2
}

DamageType type = DamageType.Fire | DamageType.Poison;
```

주의점:

- 값은 보통 1, 2, 4, 8처럼 2의 거듭제곱으로 둡니다.
- Unity Inspector에서 enum flags를 편하게 다루려면 `EnumFlagsField` 같은 에디터 API와 함께 쓰기도 합니다.

---

### 16-4. `[Conditional]`

```csharp
using System.Diagnostics;

public static class DebugLogHelper
{
    [Conditional("UNITY_EDITOR")]
    public static void EditorOnlyLog(string message)
    {
        UnityEngine.Debug.Log(message);
    }
}
```

`UNITY_EDITOR` 심볼이 없으면 호출 코드가 컴파일 결과에서 빠집니다.

---

### 16-5. `[DllImport]`

```csharp
using System.Runtime.InteropServices;

public static class NativePlugin
{
    [DllImport("MyNativePlugin")]
    private static extern int Add(int a, int b);
}
```

주의점:

- 플랫폼별 네이티브 플러그인 배치가 필요합니다.
- IL2CPP, iOS, Android 등 플랫폼별 제약을 확인해야 합니다.

---

### 16-6. Caller Info 어트리뷰트

로그 유틸리티에서 자주 쓸 수 있습니다.

```csharp
using System.Runtime.CompilerServices;
using UnityEngine;

public static class LogUtil
{
    public static void Log(
        string message,
        [CallerMemberName] string memberName = "",
        [CallerFilePath] string filePath = "",
        [CallerLineNumber] int lineNumber = 0)
    {
        Debug.Log($"[{memberName}:{lineNumber}] {message}");
    }
}
```

---

### 16-7. `[AttributeUsage]`로 커스텀 어트리뷰트 만들기

```csharp
using System;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public class DevNoteAttribute : Attribute
{
    public string Note { get; }

    public DevNoteAttribute(string note)
    {
        Note = note;
    }
}
```

사용:

```csharp
[DevNote("전투 테스트용 임시 클래스")]
public class TempCombatTester
{
}
```

---

## 17. Unity에서 특히 헷갈리는 조합

### 17-1. `[SerializeField]` vs `public`

```csharp
public int hp;
```

- Inspector에 보입니다.
- 다른 클래스에서 접근할 수 있습니다.
- 캡슐화가 약해집니다.

```csharp
[SerializeField]
private int hp;
```

- Inspector에 보입니다.
- 다른 클래스에서 마음대로 접근할 수 없습니다.
- Unity 실무에서 더 선호되는 경우가 많습니다.

---

### 17-2. `[System.Serializable]` vs `[SerializeField]`

```csharp
[System.Serializable]
public class ItemData
{
    public string name;
}
```

- 타입 자체를 Unity가 직렬화 가능한 데이터 구조로 볼 수 있게 합니다.

```csharp
[SerializeField]
private ItemData itemData;
```

- 해당 필드를 Unity 직렬화 대상으로 만듭니다.

둘은 역할이 다릅니다. 커스텀 class를 private 필드로 Inspector에 보이게 하려면 보통 둘 다 필요합니다.

---

### 17-3. `[SerializeReference]` vs ScriptableObject

`[SerializeReference]`가 적합한 경우:

- 특정 host object 내부에서만 쓰는 다형성 데이터
- 작은 전략 객체, 조건 객체, 노드 객체
- null, 순환 참조, 같은 host 내부 공유 참조가 필요할 때

`ScriptableObject`가 적합한 경우:

- 여러 오브젝트가 같은 데이터를 공유해야 할 때
- 에셋으로 관리하고 싶을 때
- 디자이너가 별도 데이터 에셋을 만들고 조합해야 할 때
- 로딩/메모리/관리 측면에서 명확한 asset reference가 좋을 때

---

### 17-4. `[ContextMenu]` vs `[MenuItem]`

| 항목 | `[ContextMenu]` | `[MenuItem]` |
|---|---|---|
| 네임스페이스 | `UnityEngine` | `UnityEditor` |
| 붙이는 대상 | 인스턴스 메서드 | static 메서드 |
| 표시 위치 | 컴포넌트 Inspector 우클릭 메뉴 | 상단 메뉴, Assets, GameObject 등 |
| 빌드 포함 | 코드 자체는 런타임 스크립트에 있을 수 있음 | Editor 전용 |
| 용도 | 특정 컴포넌트의 편의 실행 | 프로젝트/에디터 전체 도구 |

---

### 17-5. `[ExecuteAlways]` 사용 시 주의

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

        // Edit Mode에서만 실행할 코드
    }
}
```

주의할 점:

- Edit Mode에서 매 프레임 실행될 수 있습니다.
- 씬을 dirty 상태로 만들 수 있습니다.
- Undo 기록 없이 값을 바꾸면 사용자가 되돌리기 어렵습니다.
- 에디터 전용 로직은 `#if UNITY_EDITOR`로 분리하는 것이 안전할 수 있습니다.

---

## 18. 커스텀 어트리뷰트 작성 패턴

### 18-1. 단순 마커 어트리뷰트

```csharp
using System;

[AttributeUsage(AttributeTargets.Class)]
public class AutoRegisterAttribute : Attribute
{
}
```

사용:

```csharp
[AutoRegister]
public class FireSkill
{
}
```

리플렉션으로 찾기:

```csharp
var types = AppDomain.CurrentDomain.GetAssemblies()
    .SelectMany(a => a.GetTypes())
    .Where(t => Attribute.IsDefined(t, typeof(AutoRegisterAttribute)));
```

---

### 18-2. Unity Inspector용 커스텀 PropertyAttribute

런타임 어셈블리:

```csharp
using UnityEngine;

public class RequiredFieldAttribute : PropertyAttribute
{
}
```

Editor 어셈블리:

```csharp
#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

[CustomPropertyDrawer(typeof(RequiredFieldAttribute))]
public class RequiredFieldDrawer : PropertyDrawer
{
    public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
    {
        EditorGUI.PropertyField(position, property, label);

        if (property.propertyType == SerializedPropertyType.ObjectReference &&
            property.objectReferenceValue == null)
        {
            var warningRect = new Rect(position.x, position.y + EditorGUIUtility.singleLineHeight, position.width, EditorGUIUtility.singleLineHeight);
            EditorGUI.HelpBox(warningRect, "필수 참조가 비어 있습니다.", MessageType.Warning);
        }
    }

    public override float GetPropertyHeight(SerializedProperty property, GUIContent label)
    {
        bool missing = property.propertyType == SerializedPropertyType.ObjectReference &&
                       property.objectReferenceValue == null;

        return missing
            ? EditorGUIUtility.singleLineHeight * 2.2f
            : EditorGUIUtility.singleLineHeight;
    }
}
#endif
```

사용:

```csharp
[RequiredField]
[SerializeField]
private Transform target;
```

---

## 19. 실무에서 먼저 외우면 좋은 순서

### 1순위: 거의 매일 보거나 쓰는 것

- `[SerializeField]`
- `[System.Serializable]`
- `[Header]`
- `[Tooltip]`
- `[Range]`
- `[Min]`
- `[HideInInspector]`
- `[RequireComponent]`
- `[DisallowMultipleComponent]`
- `[CreateAssetMenu]`
- `[ContextMenu]`
- `[MenuItem]`
- `[CustomEditor]`
- `[CustomPropertyDrawer]`

### 2순위: 프로젝트가 커지면 중요해지는 것

- `[FormerlySerializedAs]`
- `[SerializeReference]`
- `[DefaultExecutionOrder]`
- `[ExecuteAlways]`
- `[RuntimeInitializeOnLoadMethod]`
- `[InitializeOnLoad]`
- `[InitializeOnLoadMethod]`
- `[DidReloadScripts]`
- `[PostProcessBuild]`
- `[ScriptedImporter]`
- `[Preserve]`
- `[Shortcut]`

### 3순위: 도구/렌더링/고급 에디터 확장

- `[DrawGizmo]`
- `[EditorTool]`
- `[EditorToolbarElement]`
- `[SettingsProvider]`
- `[SearchItemProvider]`
- `[UxmlElement]`
- `[UxmlAttribute]`
- `[ImageEffectAllowedInSceneView]`
- Shader keyword filtering 계열
- Unity 내부 native binding 계열

---

## 20. 간단한 암기법

| 하고 싶은 일 | 떠올릴 어트리뷰트 |
|---|---|
| private 값을 Inspector에 보이고 싶다 | `[SerializeField]` |
| 커스텀 class를 Inspector에 펼쳐 보이고 싶다 | `[System.Serializable]` |
| 필드명을 바꿨는데 기존 프리팹 값을 살리고 싶다 | `[FormerlySerializedAs]` |
| 추상 클래스/인터페이스 기반 데이터를 저장하고 싶다 | `[SerializeReference]` |
| 컴포넌트가 Rigidbody를 반드시 필요로 한다 | `[RequireComponent]` |
| 같은 컴포넌트 중복 추가를 막고 싶다 | `[DisallowMultipleComponent]` |
| ScriptableObject 생성 메뉴를 만들고 싶다 | `[CreateAssetMenu]` |
| Unity 상단 메뉴에 도구를 만들고 싶다 | `[MenuItem]` |
| 컴포넌트 우클릭 메뉴에 기능을 넣고 싶다 | `[ContextMenu]` |
| Inspector를 직접 만들고 싶다 | `[CustomEditor]` |
| 특정 필드 표시 방식을 바꾸고 싶다 | `[CustomPropertyDrawer]` |
| 에디터 로드 시 자동 실행하고 싶다 | `[InitializeOnLoad]`, `[InitializeOnLoadMethod]` |
| 런타임 시작 시 자동 실행하고 싶다 | `[RuntimeInitializeOnLoadMethod]` |
| IL2CPP 빌드에서 리플렉션 대상이 삭제되지 않게 하고 싶다 | `[Preserve]` |
| Unity Test Framework에서 코루틴 테스트를 만들고 싶다 | `[UnityTest]` |

---

## 21. 자주 하는 실수

### 21-1. 프로퍼티에 `[SerializeField]`를 붙이려고 함

```csharp
[SerializeField]
public int Hp { get; private set; } // 일반적으로 원하는 대로 직렬화되지 않음
```

보통은 backing field를 사용합니다.

```csharp
[SerializeField]
private int hp;

public int Hp => hp;
```

최신 C#의 field target 문법을 쓰는 경우도 있지만, Unity 버전과 팀 컨벤션에 따라 혼란이 생길 수 있어 초반에는 backing field가 안전합니다.

---

### 21-2. Editor 코드가 Runtime Assembly에 들어감

```csharp
using UnityEditor; // 런타임 빌드에서 문제
```

해결:

- `Assets/Editor` 폴더에 넣기
- Editor 전용 Assembly Definition으로 분리
- 필요한 경우 `#if UNITY_EDITOR` 사용

---

### 21-3. `[ExecuteAlways]`에서 Play Mode와 Edit Mode를 구분하지 않음

Edit Mode에서 오브젝트 생성/삭제/값 변경이 일어나면 씬이 의도치 않게 바뀔 수 있습니다.

---

### 21-4. `[FormerlySerializedAs]` 없이 필드명을 바꿈

프리팹, 씬, ScriptableObject에 저장된 값이 사라진 것처럼 보일 수 있습니다.

---

### 21-5. `[SerializeReference]`를 모든 곳에 쓰려 함

다형성이 필요 없다면 기본 직렬화나 ScriptableObject가 더 단순하고 안정적일 수 있습니다.

---

### 21-6. `[ThreadStatic]` 사용 주의

Unity 공식 문서에는 Unity script에 .NET `[ThreadStatic]`을 사용하지 말라는 주의가 있습니다. 스레드별 정적 상태가 필요한 경우 Unity 버전과 사용 맥락을 확인하고 대체 설계를 고려하는 편이 안전합니다.

---

## 22. 대표 예제: 에디터 메뉴로 프리팹 자동 세팅

질문에 나온 `[MenuItem("Combat/Setup Animated Agent Prefabs")]` 형태의 예시입니다.

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

- `MenuItem`은 static 메서드에 붙습니다.
- 두 번째 `MenuItem(..., true)`는 검증 함수입니다.
- 선택된 오브젝트가 없으면 메뉴를 비활성화할 수 있습니다.
- 실제 프리팹 에셋 수정까지 하려면 `PrefabUtility`, `AssetDatabase.SaveAssets()` 등을 추가로 고려해야 합니다.

---

## 23. 대표 예제: 데이터 클래스 + ScriptableObject + Inspector 정리

```csharp
using UnityEngine;
using UnityEngine.Serialization;

[System.Serializable]
public class ItemStat
{
    [Tooltip("공격력 보정값")]
    [Min(0)]
    public int attackBonus;

    [Tooltip("방어력 보정값")]
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
    [TextArea(3, 6)]
    [SerializeField]
    private string description;
}
```

이 예시에서 사용한 것:

- `[System.Serializable]`: `ItemStat`을 Unity 직렬화 가능 데이터로 만듦
- `[CreateAssetMenu]`: `ItemData` 에셋 생성 메뉴 등록
- `[Header]`, `[Tooltip]`, `[Min]`, `[TextArea]`: Inspector 표시 개선
- `[SerializeField]`: private 필드 노출
- `[FormerlySerializedAs]`: 예전 필드명 `desc`의 데이터 유지

---

## 24. 대표 예제: 커스텀 어트리뷰트와 PropertyDrawer

### 런타임 코드

```csharp
using UnityEngine;

public class SceneNameAttribute : PropertyAttribute
{
}
```

### 에디터 코드

```csharp
#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

[CustomPropertyDrawer(typeof(SceneNameAttribute))]
public class SceneNameDrawer : PropertyDrawer
{
    public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
    {
        EditorGUI.PropertyField(position, property, label);
    }
}
#endif
```

### 사용

```csharp
public class SceneLoaderConfig : MonoBehaviour
{
    [SceneName]
    [SerializeField]
    private string sceneName;
}
```

처음에는 단순히 표시만 해도 되고, 나중에 Build Settings의 씬 목록을 드롭다운으로 보여주도록 확장할 수 있습니다.

---

## 25. 외부 패키지에서 자주 보이는 Attribute

Unity 기본은 아니지만, 실무나 예제에서 자주 보이는 패키지성 어트리뷰트도 있습니다.

### 25-1. Odin Inspector

예시:

```csharp
[Button]
private void ResetData() {}

[ReadOnly]
[SerializeField]
private int id;

[ShowIf(nameof(useAdvanced))]
public float advancedValue;
```

특징:

- 매우 강력한 Inspector 커스터마이즈
- 유료 에셋
- Unity 기본 어트리뷰트가 아님

### 25-2. NaughtyAttributes

예시:

```csharp
[Button]
private void Generate() {}

[Required]
public Transform target;

[ShowIf("isDebug")]
public int debugValue;
```

특징:

- Unity Inspector 확장 패키지
- 기본 Unity API가 아니므로 프로젝트에 패키지가 있어야 동작

### 25-3. Netcode for GameObjects

예시:

```csharp
[ServerRpc]
private void FireServerRpc() {}

[ClientRpc]
private void HitClientRpc() {}
```

특징:

- Unity Netcode 패키지에서 제공
- 네트워크 RPC 메서드 표시
- 기본 UnityEngine 어트리뷰트와 별개

---

## 26. 참고 링크

공식 문서를 중심으로 확인한 링크입니다.

- Unity Manual - Unity attributes  
  https://docs.unity3d.com/6000.4/Documentation/Manual/unity-attributes.html

- Unity Scripting API - AddComponentMenu  
  https://docs.unity3d.com/6000.4/Documentation/ScriptReference/AddComponentMenu.html

- Unity Scripting API - SerializeField  
  https://docs.unity3d.com/6000.4/Documentation/ScriptReference/SerializeField.html

- Unity Scripting API - SerializeReference  
  https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SerializeReference.html

- Unity Scripting API - FormerlySerializedAsAttribute  
  https://docs.unity3d.com/6000.4/Documentation/ScriptReference/Serialization.FormerlySerializedAsAttribute.html

- Unity Scripting API - RequireComponent  
  https://docs.unity3d.com/6000.4/Documentation/ScriptReference/RequireComponent.html

- Unity Scripting API - MenuItem  
  https://docs.unity3d.com/6000.4/Documentation/ScriptReference/MenuItem.html

- Unity Scripting API - InitializeOnLoadAttribute  
  https://docs.unity3d.com/ScriptReference/InitializeOnLoadAttribute.html

- Unity Scripting API - PropertyDrawer  
  https://docs.unity3d.com/6000.4/Documentation/ScriptReference/PropertyDrawer.html

- Unity Scripting API - PreserveAttribute  
  https://docs.unity3d.com/6000.4/Documentation/ScriptReference/Scripting.PreserveAttribute.html

- Unity Scripting API - UxmlElementAttribute  
  https://docs.unity3d.com/6000.3/Documentation/ScriptReference/UIElements.UxmlElementAttribute.html

- Unity Test Framework  
  https://docs.unity3d.com/Packages/com.unity.test-framework@1.3/manual/index.html

- Microsoft Learn - C# attributes  
  https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/attributes/general

- Microsoft Learn - C# language specification: Attributes  
  https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/attributes

---

## 27. 공부 추천 루트

1. 먼저 `SerializeField`, `System.Serializable`, `Header`, `Tooltip`, `Range`, `RequireComponent`, `CreateAssetMenu`를 직접 써보기
2. 작은 ScriptableObject 데이터 에셋 만들기
3. `[MenuItem]`으로 상단 메뉴에 자동화 함수 하나 만들기
4. `[ContextMenu]`로 컴포넌트 우클릭 실행 함수 만들기
5. `[CustomEditor]`로 버튼 있는 Inspector 만들기
6. `[CustomPropertyDrawer]`로 직접 만든 필드 어트리뷰트 표시 바꿔보기
7. 필드명 리팩토링 시 `[FormerlySerializedAs]` 붙이는 습관 만들기
8. 다형성 데이터가 필요할 때만 `[SerializeReference]` 공부하기
9. 빌드/에디터 자동화가 필요해지면 `[PostProcessBuild]`, `[InitializeOnLoad]`, `[ScriptedImporter]` 보기
10. UI Toolkit 에디터 도구를 만들 때 `[UxmlElement]`, `[UxmlAttribute]`로 넘어가기