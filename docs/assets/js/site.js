const pages = [
  { title: '전체 문서', url: '/attributes/', tags: 'Unity C# Attributes SerializeField System.Serializable MenuItem UnityEditor 전체 정리' },
  { title: '치트시트', url: '/cheatsheet/', tags: '빠른 분류 상황별 추천 SerializeField CreateAssetMenu ContextMenu MenuItem' },
  { title: '헷갈리는 조합', url: '/confusing-pairs/', tags: 'SerializeField public Serializable SerializeReference ScriptableObject ContextMenu MenuItem ExecuteAlways' },
  { title: '실전 예제', url: '/examples/', tags: '코드 예제 ScriptableObject CustomEditor PropertyDrawer MenuItem ContextMenu' },
  { title: '배포 방법', url: '/deploy/', tags: 'GitHub Pages docs baseurl 배포 설정 README' }
];

const input = document.querySelector('#siteSearch');
const resultBox = document.querySelector('#searchResults');
const base = document.querySelector('script[src$="site.js"]').getAttribute('src').replace('/assets/js/site.js', '');

function renderResults(keyword) {
  if (!resultBox) return;
  const q = keyword.trim().toLowerCase();
  if (!q) {
    resultBox.innerHTML = '';
    return;
  }
  const matches = pages.filter(page => `${page.title} ${page.tags}`.toLowerCase().includes(q)).slice(0, 6);
  resultBox.innerHTML = matches.length
    ? matches.map(page => `<a class="search-result" href="${base}${page.url}">${page.title}<span>${page.tags}</span></a>`).join('')
    : '<div class="search-result">검색 결과가 없습니다.<span>영문 어트리뷰트 이름으로도 검색해보세요.</span></div>';
}

if (input) {
  input.addEventListener('input', event => renderResults(event.target.value));
}
