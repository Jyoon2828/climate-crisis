(function(root){
 'use strict';
 const photos={
  "canada": {
    "kind": "피해 흔적 사진",
    "alt": "2021년 산불 뒤 건물이 사라진 캐나다 리턴 마을의 2024년 모습",
    "caption": "산불 뒤, 건물이 있던 자리가 빈터로 남았어요.",
    "note": "교과서의 2021년 산불 피해 지역을 2024년에 촬영했어요.",
    "dateLabel": "촬영 2024. 3. 16.",
    "file": "world-canada.webp",
    "creator": "SounderBruce",
    "license": "CC BY-SA 4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lytton,_BC_-_Alonzo_%26_4_Street_after_the_wildfire.jpg",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "nigeria": {
    "kind": "사례 현장 사진",
    "alt": "2022년 나이지리아 아호아다에서 홍수로 물에 잠긴 길을 이동하는 주민들",
    "caption": "집 앞 길이 잠겨, 주민들이 물속으로 이동하고 있어요.",
    "note": "교과서 사례와 같은 2022년, 나이지리아 리버스주의 홍수 현장이에요.",
    "dateLabel": "촬영 2022. 10. 22.",
    "file": "world-nigeria.webp",
    "creator": "Hansel ohioma",
    "license": "CC BY-SA 4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Flood_apocalypse2.jpg",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "brazil": {
    "kind": "관련 참고 사진 · 다른 해",
    "alt": "2016년 브라질 쿠리치바에서 식물 위에 맺힌 흰 서리",
    "caption": "브라질의 식물 위에 흰 서리가 내려앉았어요.",
    "note": "2016년 촬영한 관련 참고 사진이에요. 교과서의 2022년 농작물 피해 현장 사진은 아니에요.",
    "dateLabel": "촬영 2016. 5. 11.",
    "file": "world-brazil.webp",
    "creator": "Wesley.martins.ctba",
    "license": "CC BY-SA 4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Geada_curitiba_planta.jpg",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "india": {
    "kind": "관련 참고 사진 · 다른 해",
    "alt": "2015년 인도의 더운 시기에 정전이 끝나기를 기다리며 손부채를 쓰는 주민",
    "caption": "전기가 다시 들어오기를 기다리며 손부채로 더위를 식혀요.",
    "note": "2015년 촬영한 관련 참고 사진이에요. 교과서의 2023년 피해 현장 사진은 아니에요.",
    "dateLabel": "촬영 2015. 6. 1.",
    "file": "world-india.webp",
    "creator": "Karanyadav1997",
    "license": "CC BY-SA 4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jhuljhuli_power_cut.jpg",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "germany": {
    "kind": "사례 시기의 사진",
    "alt": "2021년 2월 독일 브라운슈바이크에서 눈이 쌓인 선로를 지나는 전차",
    "caption": "전차가 다니는 선로와 길 주변에 눈이 쌓여 있어요.",
    "note": "2021년 독일 겨울의 실제 사진이에요. 이 사진만으로 교통이 얼마나 멈췄는지 알 수는 없어요.",
    "dateLabel": "촬영 2021. 2. 14.",
    "file": "world-germany.webp",
    "creator": "TeWeBs",
    "license": "CC BY-SA 4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:BS_Strassenbahn_im_Winter.JPG",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "china": {
    "kind": "위성 관측 영상 · 색 합성",
    "alt": "2022년 7월과 8월 중국 포양호의 물이 줄어든 모습을 비교한 위성 영상",
    "caption": "같은 호수인데, 한 달 사이 물이 있는 넓이가 줄었어요.",
    "note": "왼쪽 2022. 7. 10. → 오른쪽 8. 27. 관측. 물과 땅을 구분하기 쉽게 색을 합성한 위성 영상이에요.",
    "dateLabel": "관측 2022. 7. 10. / 8. 27.",
    "file": "world-china.webp",
    "creator": "NASA Earth Observatory / Joshua Stevens; Landsat data: U.S. Geological Survey",
    "license": "Public domain (NASA / USGS)",
    "sourceUrl": "https://science.nasa.gov/earth/earth-observatory/parched-poyang-lake-150285/",
    "licenseUrl": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
  }
};
 root.WorldPhotos=photos;if(typeof module!=='undefined'&&module.exports)module.exports=photos;
})(typeof window!=='undefined'?window:globalThis);
