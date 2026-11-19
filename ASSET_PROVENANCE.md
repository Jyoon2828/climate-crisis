# 마을 장면 제작 기록

실제 사진의 저작자·라이선스는 PHOTO_CREDITS.md에 기록했습니다. 실제 사진은 수치 관측과 서로 다른 사건일 수 있어 앱에 사진 맥락을 표시합니다.

다음 네 장면은 내장 이미지 생성 도구로 이 프로젝트를 위해 제작한 가상 마을입니다. 실제 지역 사진이나 미래 예측 자료가 아닙니다. 프로젝트에는 WebP로 변환한 자산을 포함했습니다.

- `assets/village.webp`: 한국의 해안 마을, 학교·운동장·농장·시장·강·공장·해안 산책로를 포함한 고정 항공 사선 구도. 현실적인 재료와 빛을 표현한 건축 디오라마. 사람·문자·도표 없이 생성.
- `assets/dry.webp`: 같은 구도와 건물 배치를 유지하고, 장기간 더위·물 부족으로 운동장과 초목이 누렇게 마르고 강물이 줄며 농작물이 시드는 상황으로 편집. 바다는 유지.
- `assets/flood.webp`: 같은 구도와 건물 배치를 유지하고, 강 범람으로 낮은 도로·농장·주거 일부가 침수되는 가상 상황으로 편집. 흐린 하늘과 비.
- `assets/snow.webp`: 같은 구도와 건물 배치를 유지하고, 도로·지붕·운동장에 깊은 눈이 쌓이며 비닐하우스에 눈의 무게가 가해지는 가상 상황으로 편집.

기본 프롬프트: “Create a realistic detailed 3D architectural miniature of a fictional South Korean coastal village, aerial oblique view, with readable school, sports field, homes, farm, greenhouse, grocery, river, factory, forest, harbor and coastal walkway. No people, typography, labels, UI or charts.”

변형 프롬프트 공통: “Keep exact camera, crop, aspect ratio, geography and all building locations aligned. Change only weather, water and physical condition of land, crops and facilities. This is an illustrative fictional scenario, not documentary evidence.” 각 변형의 추가 조건은 위 설명과 같습니다.

입체 수조는 이미지가 아니라 Canvas의 3차원 좌표 투영으로 구현합니다. 땅 높이, 건물 배치와 수면 높이로 침수 여부를 결정하며 시점 회전·확대를 지원합니다. 물을 수평면에서 자른 입체 부피로 표시하고 수면 위·아래의 건물 형상을 나누어 그립니다. 물줄기·잔물결·반투명 물층은 코드로 구현하며, 유체역학 예측 계산을 뜻하지 않습니다.

세계 사례의 `assets/world-*.webp` 여섯 파일은 생성 이미지가 아닙니다. 실제 사진 다섯 장과 NASA의 실제 위성 관측 비교 영상 한 장이며, 날짜·저작자·원본·라이선스·사례와의 관계는 PHOTO_CREDITS.md 및 앱의 출처 창에 기록했습니다.

수조의 학교·집·빌딩·아파트·병원·가게는 각기 다른 3차원 좌표 면으로 구성하며 물 높이에서 같은 방식으로 잘라 그립니다. 건물 선택창의 미리보기는 코드로 그린 SVG입니다.

## 마을에서 행동하기

`assets/actions/*.webp`는 물건을 직접 눌러 선택하는 데 쓰는 가상 사물 그림 12장입니다. 같은 스튜디오 조명과 구도의 생성 이미지 두 장에서 사물별로 분리했습니다. 일회용 컵과 물병, 열린 냉장고와 닫힌 냉장고, 벌목한 나무와 묘목, 석탄 보일러와 단열한 보일러, 자동차와 자전거, 켠 전등과 끈 전등을 짝지었습니다. 지도에는 같은 주제의 투명 소품 6개(map-*.webp)를 별도로 제작해 겹쳐 놓았습니다.
