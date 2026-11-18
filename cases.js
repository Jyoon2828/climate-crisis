window.CLIMATE_CASES = [
  {
    "id": "heat",
    "name": "폭염",
    "en": "HEAT WAVE",
    "no": "01",
    "color": "#e78545",
    "pale": "#fff0e2",
    "headline": "매우 더운 날은 얼마나 많아졌을까?",
    "short": "낮의 더위와 오랜 기록을 살펴봐요.",
    "definition": "매우 더운 날씨가 나타나는 현상이에요.",
    "facts": [
      {
        "title": "어떤 현상일까?",
        "text": "폭염은 매우 더운 날씨를 말해요. 강한 햇볕이 보인다는 사실만으로 판단하기보다 기온 기록도 함께 확인해요."
      },
      {
        "title": "무엇을 세었을까?",
        "text": "이 자료의 폭염일수는 하루 최고기온이 33℃ 이상인 날의 수예요. 어떤 시간의 기온을 기준으로 세었는지 확인해요."
      },
      {
        "title": "자료를 어떻게 읽을까?",
        "text": "기상청은 여러 관측지점의 기록을 모아 전국 평균을 구했어요. 과거 10년과 최근 10년의 한 해 평균을 비교해 보세요."
      }
    ],
    "datasets": [
      {
        "title": "과거와 최근의 폭염일수",
        "type": "장기 비교",
        "unit": "일",
        "measure": "연평균 폭염일수",
        "geography": "전국 평균(기상청 전국 평균 산출 62개 관측지점)",
        "period": "1973~1982년과 2016~2025년",
        "labels": [
          "1973~1982년",
          "2016~2025년"
        ],
        "shortLabels": [
          "과거 10년",
          "최근 10년"
        ],
        "values": [
          8.3,
          18.3
        ],
        "max": 20,
        "step": 5,
        "note": "두 기간에서 한 해 평균 며칠 발생했는지 비교해요. 모든 해의 값이 같다는 뜻은 아니에요.",
        "limit": "두 기간의 평균을 비교하는 자료예요. 중간의 모든 해가 어떻게 달라졌는지는 이 두 막대만으로 알 수 없어요.",
        "readHint": "막대 아래의 기간과 세로축의 단위부터 확인하세요.",
        "sourceIndexes": [
          0
        ],
        "id": "heat-observations"
      }
    ],
    "questions": [
      "과거와 최근 중 폭염일수의 평균이 더 큰 기간은 언제인가요? 두 수치를 찾아보세요.",
      "이 자료로 알 수 있는 변화는 무엇인가요? 모든 해에 똑같이 늘었다고도 말할 수 있을까요?"
    ],
    "compare": {
      "other": "night",
      "question": "폭염과 열대야는 각각 어느 시간의 어떤 기온을 살펴볼까요?"
    },
    "sources": [
      {
        "title": "폭염은 빨라지고 열대야는 늦게까지 지속, 발생 빈도 증가와 함께 발생 기간도 확대되고 있다",
        "publisher": "기상청",
        "date": "2026. 7. 24.",
        "url": "https://www.weather.go.kr/kma/flexer/html/press/2026/07/24/ATC202607240830013_0f94522e-30fa-4234-97ce-379bd1a92db8.hwp.files/Sections1.html",
        "location": "본문 발생일수 변화 특성 및 붙임 1"
      }
    ],
    "photo": {
      "key": "heat",
      "filename": "heat.jpg",
      "title": "File:(20260628) Berlin heatwave 125049.jpg",
      "source_url": "https://commons.wikimedia.org/wiki/File:(20260628)_Berlin_heatwave_125049.jpg",
      "original_url": "https://upload.wikimedia.org/wikipedia/commons/f/f3/%2820260628%29_Berlin_heatwave_125049.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "download_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/%2820260628%29_Berlin_heatwave_125049.jpg/1280px-%2820260628%29_Berlin_heatwave_125049.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "creator": "Roy Zuo",
      "license": "CC BY-SA 4.0",
      "license_url": "https://creativecommons.org/licenses/by-sa/4.0",
      "description": "People playing with water and cooling off at Lustgarten fountain in Berlin, Germany, during heatwave in June 2026.",
      "date": "2026-06-28 12:50:49",
      "commons_page_id": 194960880,
      "modifications": "없음. Wikimedia Commons가 제공한 축소본을 사용합니다.",
      "display_creator": "Roy Zuo",
      "caption_ko": "독일 베를린의 더운 날, 분수대 주변에서 더위를 식히는 사람들(2026. 6. 28.)",
      "alt_ko": "뜨거운 날 분수대 주변에 모인 사람들",
      "context_note_ko": "폭염으로 설명된 실제 촬영 장면입니다. 우리나라 그래프의 관측 장소·기간과는 다릅니다."
    },
    "pairLabel": "폭염 ↔ 열대야"
  },
  {
    "id": "drought",
    "name": "가뭄",
    "en": "DROUGHT",
    "no": "02",
    "color": "#b18a43",
    "pale": "#f7f0df",
    "headline": "비가 부족한 날들이 오래 이어진다면?",
    "short": "비가 적게 내리는 기간과 지역을 살펴봐요.",
    "definition": "평소보다 비가 적게 내리는 상태가 오래 이어질 때 나타날 수 있어요.",
    "facts": [
      {
        "title": "어떤 현상일까?",
        "text": "가뭄은 평소보다 비가 적게 내리는 상태가 오래 이어질 때 나타날 수 있어요. 하루 비가 오지 않았다는 사실만으로 판단하지는 않아요."
      },
      {
        "title": "어떤 기록일까?",
        "text": "2022년에는 지역에 따라 비가 내리는 모습이 달랐어요. 기상청은 가뭄이 나타난 날의 수를 계산해 지역별 평균을 냈어요."
      },
      {
        "title": "왜 소수가 있을까?",
        "text": "한 지역 안의 여러 시·군을 평균했기 때문이에요. 지역의 모든 곳에서 같은 날부터 같은 기간 동안 가뭄이 이어졌다는 뜻은 아니에요."
      }
    ],
    "datasets": [
      {
        "title": "2022년 지역별 기상가뭄 발생일수",
        "type": "한 해의 지역 비교",
        "unit": "일",
        "measure": "기상가뭄 발생일수의 지역 평균",
        "geography": "서울·인천·경기 / 광주·전남 / 부산·울산·경남",
        "period": "2022년 1~12월",
        "labels": [
          "서울·인천·경기",
          "광주·전남",
          "부산·울산·경남"
        ],
        "shortLabels": [
          "서울·인천·경기",
          "광주·전남",
          "부산·울산·경남"
        ],
        "values": [
          64.6,
          281.3,
          249.5
        ],
        "max": 300,
        "step": 50,
        "note": "각 지역에 속한 여러 시·군의 평균이에요. 연속하여 비가 오지 않은 날의 수와는 달라요.",
        "limit": "2022년 한 해의 지역별 차이를 비교해요. 오랜 변화를 알려면 여러 해의 기록이 더 필요해요.",
        "readHint": "지역 이름과 평균한 값이라는 점을 살펴보세요.",
        "sourceIndexes": [
          0
        ],
        "id": "drought-observations"
      }
    ],
    "questions": [
      "가뭄 발생일수의 평균이 가장 큰 지역과 가장 작은 지역은 어디인가요? 수치를 근거로 말해 보세요.",
      "이 자료만으로 '해마다 가뭄이 늘어난다'고 말할 수 있을까요? 무엇이 더 필요할까요?"
    ],
    "compare": {
      "other": "flood",
      "question": "가뭄과 홍수는 물의 양과 모습에서 어떻게 다를까요?"
    },
    "sources": [
      {
        "publisher": "기상청",
        "title": "남부지방 기상가뭄, 역대 가장 오랜 기간 지속",
        "date": "2023-01-18",
        "url": "https://www.kma.go.kr/kma/servlet/NeoboardProcess?bid=press&callback=https%3A%2F%2Fwww.kma.go.kr%2Fkma%2Fnews%2Fpress.jsp&fno=3&k=ATC202301181725353_e371d873-2c73-48d8-81a5-4a081cc04971.pdf&mode=download&num=1194193&ses=USERSESSION"
      }
    ],
    "photo": {
      "key": "drought",
      "filename": "drought.jpg",
      "title": "File:Spruce Run Reservoir drought from beach (2), Nov. 2024.jpg",
      "source_url": "https://commons.wikimedia.org/wiki/File:Spruce_Run_Reservoir_drought_from_beach_(2),_Nov._2024.jpg",
      "original_url": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Spruce_Run_Reservoir_drought_from_beach_%282%29%2C_Nov._2024.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "download_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Spruce_Run_Reservoir_drought_from_beach_%282%29%2C_Nov._2024.jpg/1280px-Spruce_Run_Reservoir_drought_from_beach_%282%29%2C_Nov._2024.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "creator": "Mr. Matté (if there is an issue with this image, contact me using this image's Commons talk page, my Commons user talk page, or my English Wikipedia user talk page; I'll know about it a lot faster)",
      "license": "CC BY-SA 4.0",
      "license_url": "https://creativecommons.org/licenses/by-sa/4.0",
      "description": "Photo of a drained down Spruce Run Reservoir in Union Township, Hunterdon County, New Jersey. The reservoir was drained down due to drought. Normally this location is under water and is near the recreation area's beach. Photo taken looking west.",
      "date": "2024-11-17 12:46:08",
      "commons_page_id": 155900261,
      "modifications": "없음. Wikimedia Commons가 제공한 축소본을 사용합니다.",
      "display_creator": "Mr. Matté",
      "caption_ko": "미국 뉴저지 스프루스런 저수지의 가뭄 모습(2024. 11. 17.)",
      "alt_ko": "저수지 물이 줄어 드러난 갈라진 바닥",
      "context_note_ko": "이 사진은 미국의 가뭄 사례입니다. 우리나라 가뭄일수 자료의 관측 장소·기간과는 다릅니다."
    },
    "pairLabel": "가뭄 ↔ 홍수"
  },
  {
    "id": "flood",
    "name": "홍수",
    "en": "FLOOD",
    "no": "03",
    "color": "#508bc1",
    "pale": "#e9f2fb",
    "headline": "많아진 물이 주변으로 넘쳐흐른다면?",
    "short": "물이 넘친 모습과 비의 양을 함께 살펴봐요.",
    "definition": "물이 크게 불어나거나 하천의 물이 주변으로 넘쳐흐르는 현상이에요.",
    "facts": [
      {
        "title": "어떤 현상일까?",
        "text": "홍수는 물이 크게 불어나거나 하천의 물이 넘쳐흐르는 현상이에요. 비가 내리는 모습과 물이 넘친 모습을 구별해서 살펴보세요."
      },
      {
        "title": "실제로 어떤 일이 있었을까?",
        "text": "2022년 8월 서울에 짧은 시간 동안 많은 비가 내렸어요. 도림천이 넘치거나 도로가 물에 잠기는 일이 보고되었어요."
      },
      {
        "title": "그래프가 보여 주는 것은?",
        "text": "이 그래프는 그때 각 관측소에서 가장 비가 많이 내린 1시간의 양이에요. 홍수가 난 횟수나 잠긴 물의 깊이를 센 자료는 아니에요."
      }
    ],
    "datasets": [
      {
        "title": "2022년 8월 서울의 1시간 최대 강수량",
        "type": "한 사건의 지역 비교",
        "unit": "mm",
        "measure": "가장 많이 내린 1시간 동안의 강수량",
        "geography": "서울의 동작·강남·서초·현충원 관측소",
        "period": "2022년 8월 8~9일",
        "labels": [
          "동작",
          "강남",
          "서초",
          "현충원"
        ],
        "values": [
          141.5,
          116.0,
          110.5,
          102.0
        ],
        "max": 160,
        "step": 40,
        "note": "두 날짜 중 각 관측소에서 가장 많이 내린 1시간의 양이에요. 그 시각은 관측소마다 다를 수 있어요.",
        "limit": "비의 양을 살펴보는 단서예요. 홍수 발생 여부는 범람 기록이나 물 높이 등도 함께 확인해야 해요.",
        "readHint": "1시간 동안 내린 비의 양이며 단위는 mm예요.",
        "sourceIndexes": [
          0
        ],
        "id": "flood-observations"
      }
    ],
    "questions": [
      "1시간 동안 내린 비가 가장 많았던 관측소는 어디인가요? 수치를 찾아 말해 보세요.",
      "비가 많이 내린 기록 외에, 홍수가 일어났는지 알려면 어떤 자료를 함께 살펴봐야 할까요?"
    ],
    "compare": {
      "other": "drought",
      "question": "가뭄과 홍수를 구별하려면 물의 어떤 모습을 살펴보아야 할까요?"
    },
    "sources": [
      {
        "publisher": "서울연구원",
        "title": "2022년 8월 집중호우, 서울시의 강우량과 피해특성은?",
        "date": "2022-08-29",
        "url": "https://www.si.re.kr/bbs/view.do?key=2024100042&pstSn=2208290002"
      },
      {
        "publisher": "국토연구원",
        "title": "기후위기시대 도시침수 예방대책: 2022년 수도권 집중호우의 교훈 (이슈리포트 제67호)",
        "date": "2022-09-07",
        "url": "https://www.krihs.re.kr/boardDownload.es?bid=0008&list_no=384324&seq=2"
      },
      {
        "publisher": "K-water 물정보포털",
        "title": "홍수의 정의와 유형",
        "date": null,
        "url": "https://www.water.or.kr/kor/menu/sub.do?menuId=16_166_167"
      }
    ],
    "photo": {
      "key": "flood",
      "filename": "flood.jpg",
      "title": "File:Kennebec River flood June 4 2012, Front Street parking lot under water.jpg",
      "source_url": "https://commons.wikimedia.org/wiki/File:Kennebec_River_flood_June_4_2012,_Front_Street_parking_lot_under_water.jpg",
      "original_url": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Kennebec_River_flood_June_4_2012%2C_Front_Street_parking_lot_under_water.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "download_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Kennebec_River_flood_June_4_2012%2C_Front_Street_parking_lot_under_water.jpg/1280px-Kennebec_River_flood_June_4_2012%2C_Front_Street_parking_lot_under_water.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "creator": "Lisa Hicks",
      "license": "CC BY 2.0",
      "license_url": "https://creativecommons.org/licenses/by/2.0",
      "description": "The Kennebec flows over the Front Street parking lot",
      "date": "2012-06-04 13:40:16",
      "commons_page_id": 121630854,
      "modifications": "없음. Wikimedia Commons가 제공한 축소본을 사용합니다.",
      "display_creator": "Lisa Hicks",
      "caption_ko": "미국 메인주 케네벡강이 넘쳐 잠긴 주차장(2012. 6. 4.)",
      "alt_ko": "강물이 넘쳐 건물 주변과 나무 아래가 잠긴 모습",
      "context_note_ko": "실제 강물 범람 사례입니다. 우리나라 강수량 자료와 같은 사건을 촬영한 사진은 아닙니다."
    },
    "pairLabel": "가뭄 ↔ 홍수"
  },
  {
    "id": "snow",
    "name": "폭설",
    "en": "HEAVY SNOW",
    "no": "04",
    "color": "#739bb2",
    "pale": "#eaf3f7",
    "headline": "어디에 눈이 얼마나 깊게 쌓였을까?",
    "short": "많이 내린 눈과 쌓인 깊이를 살펴봐요.",
    "definition": "짧은 시간에 눈이 매우 많이 내리는 현상이에요.",
    "facts": [
      {
        "title": "어떤 현상일까?",
        "text": "폭설을 알아보려면 얼마나 많은 눈이 얼마나 짧은 시간에 내렸는지 살펴봐요. 매우 춥다는 사실과는 구별해요."
      },
      {
        "title": "무엇을 잰 기록일까?",
        "text": "2024년 11월 하순에는 수도권에 많은 눈이 내렸어요. 이 자료는 11월 28일 각 관측지점에서 눈이 가장 깊게 쌓여 있던 때의 깊이예요."
      },
      {
        "title": "새로 내린 눈의 양일까?",
        "text": "그날 새로 내린 눈만 센 것은 아니에요. 이전부터 쌓여 있던 눈을 포함해 땅 위에 있는 눈의 깊이를 관측했어요."
      }
    ],
    "datasets": [
      {
        "title": "2024년 11월 28일, 어디에 눈이 얼마나 쌓였을까?",
        "type": "한 사건의 지역 비교",
        "unit": "cm",
        "measure": "그날 눈이 가장 깊게 쌓였을 때의 깊이(일최심적설)",
        "geography": "서울·인천·수원 기상관측지점",
        "period": "2024년 11월 28일",
        "labels": [
          "서울",
          "인천",
          "수원"
        ],
        "values": [
          28.6,
          26.0,
          43.0
        ],
        "max": 50,
        "step": 10,
        "note": "그날 새로 내린 눈의 총량과는 달라요. 이전에 쌓인 눈도 포함한 깊이예요.",
        "limit": "같은 날 세 장소를 비교해요. 해마다 폭설이 늘었는지를 알아보려면 여러 해의 기록이 필요해요.",
        "readHint": "땅 위에 쌓인 눈의 깊이를 cm로 나타냈어요.",
        "sourceIndexes": [
          0
        ],
        "id": "snow-observations"
      }
    ],
    "questions": [
      "세 지역 중 눈이 가장 깊게 쌓인 곳은 어디인가요? 가장 얕은 곳과 몇 cm 차이가 나나요?",
      "이 자료만 보고 '해마다 폭설이 많아진다'고 말할 수 있을까요? 어떤 자료가 더 필요할까요?"
    ],
    "compare": {
      "other": "cold",
      "question": "폭설과 한파는 각각 눈의 양과 기온 중 무엇에 주목할까요?"
    },
    "sources": [
      {
        "title": "기상청, 2024년 가을철 기후특성: 평균기온 역대 가장 높았고 서울 등 11월 일최심적설 최곳값 기록",
        "date": "2024-12-06(보도시점); 2024-12-05(배포)",
        "url": "https://www.weather.go.kr/kma/flexer/html/press/2024/12/05/ATC202412051650552_bbc51c27-4fcb-4561-993c-3659fdbf692b.hwp.files/Sections1.html",
        "location": "본문 2쪽: 11월 하순 많은 눈 및 일최심신적설(a), 일최심적설(b) 표"
      }
    ],
    "photo": {
      "key": "snow",
      "filename": "snow.jpg",
      "title": "File:Snowstorm in Quebec City on February 13, 2025.jpg",
      "source_url": "https://commons.wikimedia.org/wiki/File:Snowstorm_in_Quebec_City_on_February_13,_2025.jpg",
      "original_url": "https://upload.wikimedia.org/wikipedia/commons/9/91/Snowstorm_in_Quebec_City_on_February_13%2C_2025.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "download_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Snowstorm_in_Quebec_City_on_February_13%2C_2025.jpg/1280px-Snowstorm_in_Quebec_City_on_February_13%2C_2025.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "creator": "Wilfredor",
      "license": "CC0",
      "license_url": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "description": "Snowstorm in Quebec City on February 13, 2025, a car almost buried under the snow on a street in 850 Av. de Bourlamaque.",
      "date": "2025-02-13 18:26:55",
      "commons_page_id": 159716791,
      "modifications": "없음. Wikimedia Commons가 제공한 축소본을 사용합니다.",
      "display_creator": "Wilfredor",
      "caption_ko": "캐나다 퀘벡시의 폭설, 눈에 덮인 자동차(2025. 2. 13.)",
      "alt_ko": "매우 많은 눈이 쌓여 자동차가 거의 덮인 거리",
      "context_note_ko": "이 사진은 캐나다의 폭설 사례입니다. 우리나라 눈 깊이 자료의 관측 장소·기간과는 다릅니다."
    },
    "pairLabel": "폭설 ↔ 한파"
  },
  {
    "id": "cold",
    "name": "한파",
    "en": "COLD WAVE",
    "no": "05",
    "color": "#777bb9",
    "pale": "#eeedf9",
    "headline": "매우 추운 날의 수는 어떻게 달라졌을까?",
    "short": "눈의 양과 구별해 추위의 기록을 살펴봐요.",
    "definition": "기온이 크게 떨어지거나 매우 낮은 기온이 이어지는 추위 현상이에요.",
    "facts": [
      {
        "title": "어떤 현상일까?",
        "text": "한파는 기온이 크게 떨어지거나 매우 낮은 기온이 이어지는 추위 현상이에요. 눈이 내리지 않아도 한파가 나타날 수 있어요."
      },
      {
        "title": "어떤 날을 세었을까?",
        "text": "이 그래프의 한파일수는 아침 최저기온이 영하 12℃ 이하였던 날을 센 값이에요. 기온 기록과 눈의 양은 따로 확인해요."
      },
      {
        "title": "어디의 평균일까?",
        "text": "인천·목포·부산·서울·대구·강릉, 여섯 관측지점의 평균이에요. 어느 구간에서 늘고 어느 구간에서 줄었는지 모두 살펴보세요."
      }
    ],
    "datasets": [
      {
        "title": "여섯 관측지점의 시대별 한파일수",
        "type": "장기 비교",
        "unit": "일",
        "measure": "연평균 한파일수",
        "geography": "인천·목포·부산·서울·대구·강릉 6개 관측지점 평균",
        "period": "1970~2024년, 여섯 시기 비교",
        "labels": [
          "1970년대",
          "1980년대",
          "1990년대",
          "2000년대",
          "2010년대",
          "2020~2024년"
        ],
        "shortLabels": [
          "1970년대",
          "1980년대",
          "1990년대",
          "2000년대",
          "2010년대",
          "2020~24년"
        ],
        "values": [
          2.2,
          1.6,
          0.4,
          0.8,
          1.3,
          1.1
        ],
        "max": 2.5,
        "step": 0.5,
        "note": "2020년대 값은 2020~2024년까지만 포함해요. 6개 지점의 평균으로 전국 62개 지점 평균과 달라요.",
        "limit": "처음과 마지막뿐 아니라 중간 구간도 보세요. 이 자료만으로 앞으로 한파가 없어질 것이라고 말할 수 있을까요?",
        "readHint": "한 해에 해당하는 평균 일수이며, 0.4일도 평균한 값이에요.",
        "sourceIndexes": [
          0
        ],
        "id": "cold-observations"
      }
    ],
    "questions": [
      "한파일수가 가장 적었던 때와 가장 많았던 때는 언제인가요? 수치를 근거로 말해 보세요.",
      "1970년대와 2020~2024년을 비교하면 어떻게 달라졌나요? 중간에도 계속 같은 방향으로 변했나요?"
    ],
    "compare": {
      "other": "snow",
      "question": "눈이 많이 오는 폭설과 매우 추운 한파는 어떻게 다를까요?"
    },
    "sources": [
      {
        "title": "기상청, 우리나라 113년 기후변화 분석 보고서 발간",
        "date": "2025-12-30",
        "url": "https://www.weather.go.kr/kma/flexer/html/press/2025/12/30/ATC202512300724012_c9e94dce-2beb-454d-89b5-7dd0dcf37012.hwp.files/Sections1.html",
        "location": "본문 대상 6개 지점 안내 및 붙임 1 표 2"
      },
      {
        "title": "기상자료개방포털: 한파일수 자료설명",
        "url": "https://data.kma.go.kr/climate/cdwv/selectCdwvChart.do"
      }
    ],
    "photo": {
      "key": "cold",
      "filename": "cold.jpg",
      "title": "File:Frozen Lake Bled.jpg",
      "source_url": "https://commons.wikimedia.org/wiki/File:Frozen_Lake_Bled.jpg",
      "original_url": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Frozen_Lake_Bled.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "download_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Frozen_Lake_Bled.jpg/1280px-Frozen_Lake_Bled.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "creator": "Smihael",
      "license": "CC BY-SA 3.0",
      "license_url": "https://creativecommons.org/licenses/by-sa/3.0",
      "description": "Frozen Lake Bled",
      "date": "18 February 2012, 16:09:11 (according to Exif data)",
      "commons_page_id": 18423361,
      "modifications": "없음. Wikimedia Commons가 제공한 축소본을 사용합니다.",
      "display_creator": "Smihael",
      "caption_ko": "슬로베니아 블레드호의 얼어붙은 모습(2012. 2. 18.)",
      "alt_ko": "꽁꽁 언 호수와 겨울 나무",
      "context_note_ko": "추운 날의 얼음 모습을 보여주는 참고 사진입니다. 사진만으로 한파 발생 여부나 기온을 판단할 수는 없습니다."
    },
    "pairLabel": "폭설 ↔ 한파"
  },
  {
    "id": "night",
    "name": "열대야",
    "en": "TROPICAL NIGHT",
    "no": "06",
    "color": "#687da8",
    "pale": "#edf0f9",
    "headline": "밤에도 더운 날은 얼마나 많아졌을까?",
    "short": "밤사이 가장 낮은 기온을 살펴봐요.",
    "definition": "밤사이 최저기온이 25℃ 이상인 현상이에요.",
    "facts": [
      {
        "title": "어떤 현상일까?",
        "text": "열대야는 밤사이 최저기온이 25℃ 이상인 현상이에요. 해가 진 뒤에도 기온이 높게 이어지는 밤에 주목해요."
      },
      {
        "title": "언제의 기온일까?",
        "text": "기상청은 오후 6시 1분부터 다음 날 오전 9시까지의 최저기온을 살펴봐요. 밤의 한 시각에만 덥다고 해서 바로 판단할 수는 없어요."
      },
      {
        "title": "무엇과 비교할까?",
        "text": "낮 최고기온을 살펴보는 폭염일수와, 밤 최저기온을 살펴보는 열대야일수는 서로 다른 기록이에요. 두 현상의 기준을 비교해 보세요."
      }
    ],
    "datasets": [
      {
        "title": "과거와 최근의 열대야일수",
        "type": "장기 비교",
        "unit": "일",
        "measure": "연평균 열대야일수",
        "geography": "전국 평균(기상청 전국 평균 산출 62개 관측지점)",
        "period": "1973~1982년과 2016~2025년",
        "labels": [
          "1973~1982년",
          "2016~2025년"
        ],
        "shortLabels": [
          "과거 10년",
          "최근 10년"
        ],
        "values": [
          4.1,
          12.2
        ],
        "max": 15,
        "step": 5,
        "note": "두 기간에서 한 해 평균 며칠 발생했는지 비교해요. 모든 해의 값이 같다는 뜻은 아니에요.",
        "limit": "두 기간의 평균을 비교하는 자료예요. 중간의 모든 해가 어떻게 달라졌는지는 이 두 막대만으로 알 수 없어요.",
        "readHint": "막대 아래의 기간과 세로축의 단위부터 확인하세요.",
        "sourceIndexes": [
          0
        ],
        "id": "night-observations"
      }
    ],
    "questions": [
      "과거 10년과 최근 10년의 열대야일수 평균은 각각 며칠인가요?",
      "낮 최고기온만 알아도 열대야가 나타났는지 알 수 있을까요? 어떤 기록이 더 필요할까요?"
    ],
    "compare": {
      "other": "heat",
      "question": "열대야와 폭염은 각각 언제의 어떤 기온을 살펴볼까요?"
    },
    "sources": [
      {
        "title": "폭염은 빨라지고 열대야는 늦게까지 지속, 발생 빈도 증가와 함께 발생 기간도 확대되고 있다",
        "publisher": "기상청",
        "date": "2026. 7. 24.",
        "url": "https://www.weather.go.kr/kma/flexer/html/press/2026/07/24/ATC202607240830013_0f94522e-30fa-4234-97ce-379bd1a92db8.hwp.files/Sections1.html",
        "location": "본문 발생일수 변화 특성 및 붙임 1"
      }
    ],
    "photo": {
      "key": "night",
      "filename": "night.jpg",
      "title": "File:Seoul night skyline 2018.jpg",
      "source_url": "https://commons.wikimedia.org/wiki/File:Seoul_night_skyline_2018.jpg",
      "original_url": "https://upload.wikimedia.org/wikipedia/commons/5/56/Seoul_night_skyline_2018.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      "download_url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Seoul_night_skyline_2018.jpg/1280px-Seoul_night_skyline_2018.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
      "creator": "Takipoint123",
      "license": "CC BY-SA 4.0",
      "license_url": "https://creativecommons.org/licenses/by-sa/4.0",
      "description": "Picture of Seoul's night skyline and Han River",
      "date": "2018-07-16",
      "commons_page_id": 107807416,
      "modifications": "없음. Wikimedia Commons가 제공한 축소본을 사용합니다.",
      "display_creator": "Takipoint123",
      "caption_ko": "서울의 여름밤 풍경(2018. 7. 16.)",
      "alt_ko": "해가 진 뒤 불이 켜진 서울과 한강",
      "context_note_ko": "여름밤의 참고 사진입니다. 이 날 열대야였는지는 사진만으로 알 수 없고 밤 최저기온 기록이 필요합니다."
    },
    "pairLabel": "폭염 ↔ 열대야"
  }
];
window.DATA_CHECK_DATE = "2026. 11. 16.";
