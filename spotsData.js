/**
 * 台灣 100 景點模擬資料庫
 * ------------------------------------------------------------
 * - FEATURED：25 個人工撰寫的詳細景點
 * - MORE：75 個精簡資料，由 TEMPLATES 自動補齊導覽內容
 * - 專屬編號格式：TW-[縣市代碼]-[流水號]，例如 TW-TPE-01
 * 座標為景點概略位置（WGS84）。如需換上實景照片，填入 image 欄位即可。
 */

export const REGIONS = [
  { id: 'all', label: '全部', en: 'All' },
  { id: 'north', label: '北部', en: 'North' },
  { id: 'central', label: '中部', en: 'Central' },
  { id: 'south', label: '南部', en: 'South' },
  { id: 'east', label: '東部', en: 'East' },
  { id: 'islands', label: '離島', en: 'Islands' },
];
export const REGION_LABEL = Object.fromEntries(REGIONS.map((r) => [r.id, r.label]));
export const REGION_ORDER = ['north', 'central', 'south', 'east', 'islands'];

export const CATEGORIES = {
  nature: { id: 'nature', label: '山林景觀', en: 'Nature', color: '#16a34a', soft: '#dcfce7', model: '三角錐山' },
  coast: { id: 'coast', label: '海岸海島', en: 'Coast', color: '#0284c7', soft: '#e0f2fe', model: '椰子樹' },
  culture: { id: 'culture', label: '人文古蹟', en: 'Culture', color: '#e11d48', soft: '#ffe4e6', model: '美濃紙傘' },
  landmark: { id: 'landmark', label: '休閒樂園', en: 'Landmark', color: '#9333ea', soft: '#f3e8ff', model: '彩色摩天輪' },
  food: { id: 'food', label: '夜市美食', en: 'Food', color: '#d97706', soft: '#fef3c7', model: '黃色玉米' },
};
export const CATEGORY_ORDER = ['nature', 'coast', 'culture', 'landmark', 'food'];

export const COUNTIES = {
  TPE: { name: '臺北市', region: 'north', foods: ['牛肉麵', '福州胡椒餅', '珍珠奶茶'] },
  NTP: { name: '新北市', region: 'north', foods: ['淡水阿給', '九份芋圓', '深坑豆腐'] },
  KEE: { name: '基隆市', region: 'north', foods: ['鼎邊趖', '營養三明治', '泡泡冰'] },
  TYN: { name: '桃園市', region: 'north', foods: ['大溪豆乾', '石門活魚', '龍岡米干'] },
  HSZ: { name: '新竹市', region: 'north', foods: ['新竹貢丸', '新竹米粉', '鴨肉許'] },
  HSQ: { name: '新竹縣', region: 'north', foods: ['客家粄條', '擂茶', '新埔柿餅'] },
  MIA: { name: '苗栗縣', region: 'central', foods: ['客家小炒', '大湖草莓', '桂花釀'] },
  TXG: { name: '臺中市', region: 'central', foods: ['太陽餅', '珍珠奶茶', '大麵羹'] },
  CHA: { name: '彰化縣', region: 'central', foods: ['彰化肉圓', '爌肉飯', '鹿港蚵仔煎'] },
  NAN: { name: '南投縣', region: 'central', foods: ['魚池紅茶', '竹山番薯', '埔里紹興料理'] },
  YUN: { name: '雲林縣', region: 'central', foods: ['古坑咖啡', '西螺醬油料理', '北港花生'] },
  CYI: { name: '嘉義市', region: 'south', foods: ['火雞肉飯', '砂鍋魚頭', '方塊酥'] },
  CYQ: { name: '嘉義縣', region: 'south', foods: ['奮起湖便當', '阿里山高山茶', '布袋蚵仔'] },
  TNN: { name: '臺南市', region: 'south', foods: ['牛肉湯', '虱目魚粥', '擔仔麵'] },
  KHH: { name: '高雄市', region: 'south', foods: ['木瓜牛奶', '旗津海產', '岡山羊肉'] },
  PIF: { name: '屏東縣', region: 'south', foods: ['萬巒豬腳', '東港黑鮪魚', '恆春綠豆蒜'] },
  ILA: { name: '宜蘭縣', region: 'east', foods: ['卜肉', '三星蔥油餅', '鴨賞'] },
  HUA: { name: '花蓮縣', region: 'east', foods: ['花蓮扁食', '花蓮麻糬', '炸彈蔥油餅'] },
  TTT: { name: '臺東縣', region: 'east', foods: ['池上便當', '釋迦', '關山米苔目'] },
  PEN: { name: '澎湖縣', region: 'islands', foods: ['仙人掌冰', '小管麵線', '黑糖糕'] },
  KIN: { name: '金門縣', region: 'islands', foods: ['廣東粥', '金門貢糖', '高粱酒'] },
  LJF: { name: '連江縣', region: 'islands', foods: ['繼光餅', '老酒麵線', '魚麵'] },
};

/* ------------------------------------------------------------------ */
/* 25 個詳細景點                                                         */
/* ------------------------------------------------------------------ */
const FEATURED = [
  {
    name: '台北101', nameEn: 'Taipei 101', cc: 'TPE', category: 'landmark', lat: 25.0339, lng: 121.5645,
    altitude: '地上 508 公尺（89 樓觀景台 382 公尺）',
    bestTime: '傍晚 17:00–20:00，一次看夕陽與夜景；12/31 跨年煙火最具代表性',
    highlights: ['89 樓室內觀景台 360° 俯瞰台北盆地', '660 公噸風阻尼器與阻尼器寶寶', '信義商圈與跨年煙火'],
    history: '2004 年落成，曾為世界第一高樓（2004–2010）。外型取意竹節「節節高升」，八節量體呼應吉祥數字八，是台灣最具代表性的現代地標。',
    rating: 4.7, foods: ['鼎泰豐小籠包', '信義區百貨美食街', '永康街芒果冰'],
    description: '台北天際線的靈魂，購物、觀景與城市夜景一次到位。',
  },
  {
    name: '國立故宮博物院', short: '故宮博物院', nameEn: 'National Palace Museum', cc: 'TPE', category: 'culture', lat: 25.1024, lng: 121.5485,
    altitude: '約 60 公尺',
    bestTime: '平日上午 09:00 開館時段人潮最少',
    highlights: ['翠玉白菜與肉形石', '宋元書畫與青銅器典藏', '至善園中式庭園'],
    history: '1965 年於外雙溪落成，典藏近 70 萬件歷代文物，主體源自清宮舊藏，是世界級的中華文物寶庫。',
    rating: 4.7, foods: ['故宮晶華國寶宴', '士林大南路小吃', '外雙溪咖啡'],
    description: '千年文物在此靜靜訴說華夏工藝的巔峰。',
  },
  {
    name: '士林夜市', nameEn: 'Shilin Night Market', cc: 'TPE', category: 'food', lat: 25.088, lng: 121.5241,
    altitude: '約 10 公尺',
    bestTime: '晚上 18:00–23:00，週末最熱鬧',
    highlights: ['士林市場地下美食區', '大餅包小餅與炸雞排', '射氣球、撈金魚等夜市遊戲'],
    history: '起源於 1909 年的士林市場，百年來發展為台北規模最大、國際知名度最高的觀光夜市。',
    rating: 4.3, foods: ['大雞排', '士林大香腸', '青蛙下蛋'],
    description: '台北夜晚最熱鬧的味覺迷宮。',
  },
  {
    name: '九份老街', nameEn: 'Jiufen Old Street', cc: 'NTP', category: 'culture', lat: 25.1097, lng: 121.8445,
    altitude: '約 250–300 公尺',
    bestTime: '黃昏至入夜，紅燈籠亮起最有氛圍；雨霧天別有風情',
    highlights: ['豎崎路石階與阿妹茶樓', '遠眺基隆嶼與陰陽海', '昇平戲院'],
    history: '清代僅九戶人家，採買時總要「九份」而得名；日治時期因金礦開採盛極一時，礦業沒落後因電影《悲情城市》再度走紅。',
    rating: 4.5, foods: ['阿柑姨芋圓', '九份魚丸湯', '草仔粿'],
    description: '山城石階、紅燈籠與海景，交織出最有故事感的老街。',
  },
  {
    name: '野柳地質公園', nameEn: 'Yehliu Geopark', cc: 'NTP', category: 'coast', lat: 25.2068, lng: 121.6905,
    altitude: '海平面附近',
    bestTime: '上午 08:00–10:00 光線柔和、人潮少；避開東北季風強浪日',
    highlights: ['女王頭蕈狀岩', '燭台石與仙女鞋', '豆腐岩與海蝕地形'],
    history: '大屯山系延伸入海的岬角，歷經長年海蝕與風化，形成蕈狀岩、薑石等奇岩，女王頭是台灣最著名的地質景觀之一。',
    rating: 4.5, foods: ['野柳漁港海鮮', '萬里蟹（秋季）', '金山鴨肉'],
    description: '大自然雕刻千萬年的海岸奇岩博物館。',
  },
  {
    name: '陽明山國家公園', short: '陽明山', nameEn: 'Yangmingshan National Park', cc: 'TPE', category: 'nature', lat: 25.1557, lng: 121.548,
    altitude: '200–1,120 公尺（七星山主峰 1,120 公尺）',
    bestTime: '2–3 月花季、10–11 月芒草季',
    highlights: ['七星山主峰步道', '小油坑噴氣孔', '竹子湖海芋季'],
    history: '大屯火山群所在地，日治時期即是溫泉療養勝地，1985 年成立國家公園，是全台最接近都會的國家公園。',
    rating: 4.6, foods: ['竹子湖野菜料理', '陽明山溫泉餐', '鮮奶冰淇淋'],
    description: '從城市出發 30 分鐘，就能踏上火山與芒草原。',
  },
  {
    name: '太魯閣國家公園', short: '太魯閣', nameEn: 'Taroko National Park', cc: 'HUA', category: 'nature', lat: 24.16, lng: 121.55,
    altitude: '60–3,742 公尺',
    bestTime: '春秋兩季（3–5 月、10–11 月）；出發前請查詢步道開放狀態',
    highlights: ['燕子口與九曲洞峽谷', '長春祠', '砂卡礑步道的碧綠溪水'],
    history: '立霧溪切穿大理岩形成壯麗峽谷，是太魯閣族的傳統領域；中橫公路的開鑿史見證無數人的血汗，1986 年成立國家公園。',
    rating: 4.8, foods: ['太魯閣族風味餐', '花蓮扁食', '炸彈蔥油餅'],
    description: '大理岩峽谷的鬼斧神工，台灣最壯麗的地景。',
  },
  {
    name: '日月潭', nameEn: 'Sun Moon Lake', cc: 'NAN', category: 'nature', lat: 23.8576, lng: 120.9155,
    altitude: '約 748 公尺',
    bestTime: '清晨湖面晨霧；秋季有泳渡與花火節',
    highlights: ['環潭自行車道', '日月潭纜車', '向山遊客中心與拉魯島'],
    history: '台灣最大的天然淡水湖，因湖形東似日輪、西似月鉤而得名，是邵族的傳統聖地。',
    rating: 4.7, foods: ['阿婆茶葉蛋', '邵族風味餐', '日月潭紅茶'],
    description: '山嵐與湖光交織的台灣之心。',
  },
  {
    name: '阿里山', nameEn: 'Alishan', cc: 'CYQ', category: 'nature', lat: 23.51, lng: 120.805,
    altitude: '約 2,216 公尺',
    bestTime: '3–4 月櫻花季；全年清晨可觀日出與雲海',
    highlights: ['祝山觀日出', '巨木群棧道', '阿里山林業鐵路'],
    history: '日治時期因檜木林開發而建立森林鐵路，今日是鄒族文化與高山茶的故鄉，日出、雲海、晚霞、森林、鐵路並稱五奇。',
    rating: 4.7, foods: ['奮起湖便當', '阿里山高山茶', '山葵料理'],
    description: '神木、雲海與小火車，最經典的台灣山林記憶。',
  },
  {
    name: '墾丁國家公園', short: '墾丁', nameEn: 'Kenting National Park', cc: 'PIF', category: 'coast', lat: 21.948, lng: 120.78,
    altitude: '0–500 公尺',
    bestTime: '4–10 月適合水上活動；冬季落山風強勁',
    highlights: ['白沙灣與南灣', '龍磐公園草原', '船帆石'],
    history: '1984 年成立的台灣第一座國家公園，擁有珊瑚礁海岸、熱帶季風林，也是候鳥遷徙的重要路徑。',
    rating: 4.5, foods: ['烤魷魚', '恆春綠豆蒜', '港口茶'],
    description: '陽光、沙灘與珊瑚礁，台灣最南端的熱帶假期。',
  },
  {
    name: '安平古堡', nameEn: 'Anping Old Fort', cc: 'TNN', category: 'culture', lat: 23.0016, lng: 120.1606,
    altitude: '約 10 公尺',
    bestTime: '午後至黃昏，可順遊安平老街與觀夕平台',
    highlights: ['熱蘭遮城殘蹟', '安平老街', '古堡瞭望台'],
    history: '1624 年荷蘭東印度公司興建熱蘭遮城，是台灣最早的城堡，見證荷蘭、明鄭、清領與日治的歷史更迭。',
    rating: 4.4, foods: ['周氏蝦捲', '安平豆花', '劍獅烤餅'],
    description: '四百年前的紅磚城牆，台灣歷史的起點。',
  },
  {
    name: '駁二藝術特區', nameEn: 'The Pier-2 Art Center', cc: 'KHH', category: 'culture', lat: 22.62, lng: 120.2817,
    altitude: '約 5 公尺',
    bestTime: '傍晚至夜晚，搭配港邊燈光與大港橋',
    highlights: ['倉庫群藝術展覽', '大港橋旋轉開橋', '哈瑪星鐵道文化園區'],
    history: '原為高雄港第二號接駁碼頭倉庫，2002 年轉型為藝術特區，成為南台灣的文創基地。',
    rating: 4.5, foods: ['旗津海產', '鹽埕區古早味', '高雄木瓜牛奶'],
    description: '舊倉庫裡長出的港都藝術新生命。',
  },
  {
    name: '高美濕地', nameEn: 'Gaomei Wetlands', cc: 'TXG', category: 'coast', lat: 24.312, lng: 120.549,
    altitude: '海平面',
    bestTime: '日落前一小時至黃昏，退潮時可見天空之鏡',
    highlights: ['木棧道漫步', '風車與夕陽倒影', '雲林莞草生態區'],
    history: '原為海水浴場，因台中港建設使泥沙淤積而形成濕地，現在是候鳥與招潮蟹的重要棲地。',
    rating: 4.6, foods: ['清水筒仔米糕', '梧棲漁港海鮮', '大甲芋頭酥'],
    description: '夕陽、風車與天空之鏡，中部最美的黃昏。',
  },
  {
    name: '逢甲夜市', nameEn: 'Fengjia Night Market', cc: 'TXG', category: 'food', lat: 24.175, lng: 120.646,
    altitude: '約 100 公尺',
    bestTime: '晚間 18:00–24:00',
    highlights: ['大腸包小腸', '創意小吃一條街', '逢甲商圈逛街'],
    history: '依傍逢甲大學發展，以不斷推陳出新的創意小吃聞名，被譽為台灣創新小吃的發源地。',
    rating: 4.4, foods: ['明倫蛋餅', '大腸包小腸', '炙燒牛排'],
    description: '每年都有新口味誕生的小吃實驗室。',
  },
  {
    name: '清水斷崖', nameEn: 'Qingshui Cliff', cc: 'HUA', category: 'coast', lat: 24.215, lng: 121.687,
    altitude: '山壁自海拔 800 公尺以上直落太平洋',
    bestTime: '晴天上午順光，海色最湛藍',
    highlights: ['匯德步道觀景台', '崇德礫灘', '蘇花公路壯景'],
    history: '中央山脈直落太平洋所形成的斷崖海岸，綿延約 21 公里，名列台灣八景。',
    rating: 4.7, foods: ['崇德瑪黛海鮮', '新城佳興檸檬汁', '花蓮扁食'],
    description: '山與海最戲劇化的相遇。',
  },
  {
    name: '綠島', nameEn: 'Green Island', cc: 'TTT', category: 'coast', region: 'islands', lat: 22.661, lng: 121.49,
    altitude: '0–281 公尺',
    bestTime: '5–9 月海況穩定，適合浮潛',
    highlights: ['朝日溫泉海底溫泉', '柴口浮潛珊瑚礁', '綠島人權文化園區'],
    history: '古稱火燒島，是一座火山島。戒嚴時期設有政治犯監禁場所，今為人權文化園區，見證台灣民主歷程。',
    rating: 4.6, foods: ['海草冰', '飛魚炒飯', '鹿肉香腸'],
    description: '海底溫泉與珊瑚礁的火山小島。',
  },
  {
    name: '七美雙心石滬', nameEn: 'Twin Hearts Stone Weir', cc: 'PEN', category: 'coast', lat: 23.21, lng: 119.43,
    altitude: '海平面',
    bestTime: '4–9 月，退潮時雙心最完整',
    highlights: ['雙心石滬', '望夫石', '小台灣地形'],
    history: '先民以玄武岩與珊瑚礁堆砌的捕魚陷阱，雙心造型使它成為澎湖最浪漫的地標。',
    rating: 4.7, foods: ['仙人掌冰', '小管麵線', '黑糖糕'],
    description: '海上的雙心，澎湖最浪漫的明信片。',
  },
  {
    name: '莒光樓', nameEn: 'Juguang Tower', cc: 'KIN', category: 'culture', lat: 24.424, lng: 118.322,
    altitude: '約 20 公尺',
    bestTime: '春秋兩季氣候宜人',
    highlights: ['金門地標建築', '戰地文物展', '順遊金城模範街'],
    history: '1952 年為紀念戰地官兵而建，取「毋忘在莒」之意，是金門戰地精神的象徵。',
    rating: 4.3, foods: ['廣東粥', '金門貢糖', '高粱酒'],
    description: '戰地島嶼上最醒目的宮殿式地標。',
  },
  {
    name: '六福村主題遊樂園', short: '六福村', nameEn: 'Leofoo Village Theme Park', cc: 'HSQ', category: 'landmark', lat: 24.816, lng: 121.171,
    altitude: '約 200 公尺',
    bestTime: '平日上午入園，熱門設施等候較短',
    highlights: ['大怒神', '野生動物王國', '笑傲飛鷹'],
    history: '1979 年以野生動物園起家，後擴建為主題樂園，是北台灣家庭旅遊的經典去處。',
    rating: 4.2, foods: ['新竹米粉', '關西仙草', '客家粄條'],
    description: '尖叫聲與動物王國共存的北台灣樂園。',
  },
  {
    name: '劍湖山世界', nameEn: 'Janfusun Fancyworld', cc: 'YUN', category: 'landmark', lat: 23.62, lng: 120.58,
    altitude: '約 200 公尺',
    bestTime: '春秋兩季；夏季可玩水世界',
    highlights: ['衝瘋飛車', '摩天輪', '園區夜景'],
    history: '1986 年開幕，坐落古坑丘陵，是中南部大型主題樂園之一。',
    rating: 4.2, foods: ['古坑咖啡', '華山咖啡', '古坑柳丁'],
    description: '雲林丘陵上的刺激樂園。',
  },
  {
    name: '合歡山', nameEn: 'Hehuanshan', cc: 'NAN', category: 'nature', lat: 24.144, lng: 121.273,
    altitude: '3,416 公尺（主峰）',
    bestTime: '6–7 月高山杜鵑、冬季賞雪、夏季觀星',
    highlights: ['武嶺（台灣公路最高點 3,275 公尺）', '合歡山國際暗空公園', '高山杜鵑花海'],
    history: '中央山脈的高山群，台 14 甲線貫穿其間，是最容易親近的百岳之一。',
    rating: 4.8, foods: ['清境滇緬料理', '高山蔬菜', '清境羊奶'],
    description: '開車就能抵達的三千公尺星空。',
  },
  {
    name: '伯朗大道', nameEn: 'Mr. Brown Avenue', cc: 'TTT', category: 'nature', lat: 23.108, lng: 121.206,
    altitude: '約 260 公尺',
    bestTime: '7 月與 11 月稻穗金黃；春季油菜花',
    highlights: ['金城武樹', '無電線桿的稻田景觀', '單車漫遊'],
    history: '池上鄉稻田間的產業道路，因廣告拍攝爆紅，展現花東縱谷最純淨的田園風光。',
    rating: 4.6, foods: ['池上便當', '池上米', '關山米苔目'],
    description: '騎著單車穿越一望無際的金色稻浪。',
  },
  {
    name: '麗寶樂園', nameEn: 'Lihpao Land', cc: 'TXG', category: 'landmark', lat: 24.326, lng: 120.699,
    altitude: '約 250 公尺',
    bestTime: '傍晚搭天空之夢摩天輪看夕陽',
    highlights: ['天空之夢摩天輪', '探索樂園', '馬拉灣水樂園'],
    history: '前身為月眉育樂世界，2015 年更名，擁有全台最大的摩天輪之一。',
    rating: 4.3, foods: ['豐原廟東小吃', '太陽餅', '豐原排骨酥'],
    description: '在中部最高的摩天輪上看夕陽。',
  },
  {
    name: '九族文化村', nameEn: 'Formosan Aboriginal Culture Village', cc: 'NAN', category: 'landmark', lat: 23.871, lng: 120.942,
    altitude: '約 750 公尺',
    bestTime: '2–3 月櫻花祭',
    highlights: ['原住民族文化展演', '日月潭纜車連結', '歐洲宮廷花園'],
    history: '1986 年開幕，融合台灣原住民族文化展示與遊樂設施的主題園區。',
    rating: 4.3, foods: ['竹筒飯', '烤山豬肉', '小米麻糬'],
    description: '櫻花、纜車與原住民族文化的山中樂園。',
  },
  {
    name: '義大世界', nameEn: 'E-DA World', cc: 'KHH', category: 'landmark', lat: 22.729, lng: 120.408,
    altitude: '約 50 公尺',
    bestTime: '平日下午至夜晚',
    highlights: ['希臘風情遊樂園', '義大 Outlet', '園區空中纜車'],
    history: '2010 年開幕，結合樂園、購物與飯店的南台灣大型度假區。',
    rating: 4.2, foods: ['岡山羊肉', '燕巢芭樂', '木瓜牛奶'],
    description: '一站滿足玩樂、購物與住宿的南台灣度假區。',
  },
];

/* ------------------------------------------------------------------ */
/* 75 個精簡資料：[名稱, 英文, 縣市代碼, 分類, 緯度, 經度, 海拔(公尺), 選項] */
/* ------------------------------------------------------------------ */
const MORE = [
  ['龍山寺', 'Longshan Temple', 'TPE', 'culture', 25.0372, 121.4999, 10],
  ['中正紀念堂', 'Chiang Kai-shek Memorial Hall', 'TPE', 'culture', 25.035, 121.5219, 10],
  ['饒河街觀光夜市', 'Raohe Street Night Market', 'TPE', 'food', 25.0509, 121.5776, 10, { short: '饒河街夜市' }],
  ['象山步道', 'Elephant Mountain Trail', 'TPE', 'nature', 25.0274, 121.5763, 183],
  ['北投溫泉', 'Beitou Hot Spring', 'TPE', 'nature', 25.1367, 121.5066, 50],
  ['西門町', 'Ximending', 'TPE', 'landmark', 25.0421, 121.5082, 10],
  ['淡水老街', 'Tamsui Old Street', 'NTP', 'culture', 25.1696, 121.4398, 5],
  ['十分瀑布', 'Shifen Waterfall', 'NTP', 'nature', 25.048, 121.787, 170],
  ['平溪天燈老街', 'Pingxi Sky Lantern Street', 'NTP', 'culture', 25.0257, 121.7385, 180],
  ['烏來瀑布', 'Wulai Waterfall', 'NTP', 'nature', 24.864, 121.55, 250],
  ['福隆海水浴場', 'Fulong Beach', 'NTP', 'coast', 25.022, 121.944, 2],
  ['鼻頭角步道', 'Bitou Cape Trail', 'NTP', 'coast', 25.129, 121.922, 60],
  ['基隆廟口夜市', 'Keelung Miaokou Night Market', 'KEE', 'food', 25.1283, 121.7434, 5],
  ['和平島地質公園', 'Heping Island Geopark', 'KEE', 'coast', 25.16, 121.764, 5, { short: '和平島' }],
  ['大溪老街', 'Daxi Old Street', 'TYN', 'culture', 24.883, 121.287, 100],
  ['石門水庫', 'Shimen Reservoir', 'TYN', 'nature', 24.812, 121.244, 250],
  ['Xpark 水族館', 'Xpark Aquarium', 'TYN', 'landmark', 25.013, 121.215, 30, { short: 'Xpark' }],
  ['新竹城隍廟商圈', 'Hsinchu City God Temple', 'HSZ', 'food', 24.804, 120.966, 20, { short: '城隍廟' }],
  ['內灣老街', 'Neiwan Old Street', 'HSQ', 'culture', 24.705, 121.183, 240],
  ['司馬庫斯神木群', 'Smangus Giant Trees', 'HSQ', 'nature', 24.578, 121.336, 1500, { short: '司馬庫斯' }],
  ['勝興車站', 'Shengxing Station', 'MIA', 'culture', 24.387, 120.779, 402],
  ['南庄老街', 'Nanzhuang Old Street', 'MIA', 'culture', 24.597, 121.001, 260],
  ['彩虹眷村', 'Rainbow Village', 'TXG', 'culture', 24.134, 120.61, 60],
  ['宮原眼科', 'Miyahara', 'TXG', 'food', 24.138, 120.683, 70],
  ['國立自然科學博物館', 'National Museum of Natural Science', 'TXG', 'landmark', 24.157, 120.666, 80, { short: '科博館' }],
  ['武陵農場', 'Wuling Farm', 'TXG', 'nature', 24.357, 121.313, 1750],
  ['鹿港老街', 'Lukang Old Street', 'CHA', 'culture', 24.057, 120.433, 5],
  ['八卦山大佛', 'Baguashan Great Buddha', 'CHA', 'culture', 24.078, 120.556, 90],
  ['清境農場', 'Cingjing Farm', 'NAN', 'nature', 24.056, 121.162, 1750],
  ['溪頭自然教育園區', 'Xitou Nature Education Area', 'NAN', 'nature', 23.674, 120.798, 1150, { short: '溪頭' }],
  ['集集小鎮', 'Jiji Township', 'NAN', 'culture', 23.829, 120.785, 260],
  ['北港朝天宮', 'Beigang Chaotian Temple', 'YUN', 'culture', 23.568, 120.304, 15],
  ['古坑綠色隧道', 'Gukeng Green Tunnel', 'YUN', 'food', 23.641, 120.561, 110],
  ['文化路夜市', 'Wenhua Road Night Market', 'CYI', 'food', 23.48, 120.449, 30],
  ['檜意森活村', 'Hinoki Village', 'CYI', 'culture', 23.486, 120.456, 30],
  ['奮起湖老街', 'Fenqihu Old Street', 'CYQ', 'food', 23.506, 120.696, 1405],
  ['故宮南院', 'Southern Branch of the NPM', 'CYQ', 'culture', 23.472, 120.29, 15],
  ['赤崁樓', 'Chihkan Tower', 'TNN', 'culture', 22.9975, 120.2025, 10],
  ['花園夜市', 'Garden Night Market', 'TNN', 'food', 23.011, 120.2, 10],
  ['奇美博物館', 'Chimei Museum', 'TNN', 'culture', 22.9346, 120.226, 15],
  ['七股鹽山', 'Qigu Salt Mountain', 'TNN', 'coast', 23.154, 120.1, 2],
  ['國華街美食', 'Guohua Street Eats', 'TNN', 'food', 22.994, 120.199, 10],
  ['旗津海岸公園', 'Cijin Coastal Park', 'KHH', 'coast', 22.613, 120.266, 3],
  ['蓮池潭龍虎塔', 'Lotus Pond Dragon & Tiger Pagodas', 'KHH', 'culture', 22.683, 120.296, 10],
  ['六合夜市', 'Liuhe Night Market', 'KHH', 'food', 22.632, 120.3, 10],
  ['佛陀紀念館', 'Fo Guang Shan Buddha Museum', 'KHH', 'culture', 22.757, 120.443, 50],
  ['美濃客家文物館', 'Meinong Hakka Culture Museum', 'KHH', 'culture', 22.898, 120.542, 50, { short: '美濃' }],
  ['鵝鑾鼻燈塔', 'Eluanbi Lighthouse', 'PIF', 'coast', 21.902, 120.853, 50],
  ['墾丁大街', 'Kenting Street', 'PIF', 'food', 21.944, 120.797, 10],
  ['國立海洋生物博物館', 'National Museum of Marine Biology & Aquarium', 'PIF', 'landmark', 22.046, 120.698, 10, { short: '海生館' }],
  ['小琉球', 'Xiaoliuqiu', 'PIF', 'coast', 22.342, 120.374, 20, { region: 'islands' }],
  ['羅東夜市', 'Luodong Night Market', 'ILA', 'food', 24.677, 121.769, 10],
  ['礁溪溫泉公園', 'Jiaoxi Hot Spring Park', 'ILA', 'nature', 24.827, 121.77, 15],
  ['太平山', 'Taipingshan', 'ILA', 'nature', 24.496, 121.535, 1950],
  ['龜山島', 'Guishan Island', 'ILA', 'coast', 24.843, 121.951, 398],
  ['國立傳統藝術中心', 'National Center for Traditional Arts', 'ILA', 'culture', 24.686, 121.824, 5, { short: '傳藝中心' }],
  ['七星潭', 'Qixingtan Beach', 'HUA', 'coast', 24.029, 121.623, 5],
  ['東大門夜市', 'Dongdamen Night Market', 'HUA', 'food', 23.975, 121.61, 10],
  ['六十石山', 'Liushidan Mountain', 'HUA', 'nature', 23.101, 121.278, 950],
  ['遠雄海洋公園', 'Farglory Ocean Park', 'HUA', 'landmark', 23.899, 121.604, 100],
  ['鯉魚潭', 'Liyu Lake', 'HUA', 'nature', 23.93, 121.505, 130],
  ['三仙台', 'Sanxiantai', 'TTT', 'coast', 23.124, 121.411, 5],
  ['鹿野高台', 'Luye Highland', 'TTT', 'landmark', 22.918, 121.136, 350],
  ['多良車站', 'Duoliang Station', 'TTT', 'culture', 22.511, 120.96, 50],
  ['台東森林公園', 'Taitung Forest Park', 'TTT', 'nature', 22.765, 121.163, 10],
  ['蘭嶼', 'Orchid Island', 'TTT', 'coast', 22.044, 121.548, 50, { region: 'islands' }],
  ['知本溫泉', 'Zhiben Hot Spring', 'TTT', 'nature', 22.695, 121.019, 100],
  ['澎湖跨海大橋', 'Penghu Great Bridge', 'PEN', 'culture', 23.602, 119.549, 10],
  ['吉貝嶼', 'Jibei Island', 'PEN', 'coast', 23.735, 119.606, 5],
  ['澎湖天后宮', 'Penghu Tianhou Temple', 'PEN', 'culture', 23.565, 119.565, 10],
  ['北寮奎壁山摩西分海', 'Kuibishan Moses Path', 'PEN', 'coast', 23.605, 119.68, 5, { short: '摩西分海' }],
  ['翟山坑道', 'Zhaishan Tunnel', 'KIN', 'culture', 24.398, 118.318, 10],
  ['金門模範街', 'Kinmen Mofan Street', 'KIN', 'food', 24.433, 118.319, 15],
  ['北竿芹壁聚落', 'Qinbi Village', 'LJF', 'culture', 26.224, 119.996, 30],
  ['南竿藍眼淚', 'Blue Tears of Nangan', 'LJF', 'coast', 26.152, 119.93, 5],
];

/* 精簡資料的導覽內容模板 */
const TEMPLATES = {
  nature: {
    highlights: (n) => [`${n}的主要步道與觀景點`, '四季變換的山林景致', '清晨雲霧與森林芬多精'],
    bestTime: '春秋兩季（3–5 月、10–11 月）清晨出發，避開夏季午後雷陣雨',
    history: (n, c) => `${n}位於${c}，孕育豐富的動植物生態，是當地人假日親近自然的熱門去處，也是代表台灣山林之美的經典景點。`,
    desc: (n) => `走進${n}，感受台灣山林的壯闊與靜謐。`,
  },
  coast: {
    highlights: (n) => [`${n}的海岸線與地形景觀`, '夕陽與潮間帶生態', '海風單車或步道漫遊'],
    bestTime: '4–10 月晴朗天氣，傍晚欣賞夕陽；出發前留意潮汐與海況',
    history: (n, c) => `${n}是${c}最具代表性的海岸風景，長年的海浪與季風雕塑出獨特地貌，也孕育了在地的漁村文化。`,
    desc: (n) => `在${n}吹海風、看浪花，把藍色裝進旅行記憶裡。`,
  },
  culture: {
    highlights: (n) => [`${n}的歷史建築與細節`, '在地導覽與文化故事', '周邊老街散策'],
    bestTime: '平日上午人潮較少，可搭配定時導覽',
    history: (n, c) => `${n}見證了${c}的歲月流轉，從先民拓墾、日治時期到現代，層層累積出豐厚的人文記憶，是認識台灣歷史的重要現場。`,
    desc: (n) => `在${n}的老時光裡，讀一段台灣的故事。`,
  },
  landmark: {
    highlights: (n) => [`${n}的招牌設施`, '親子同遊與拍照熱點', '夜間燈光與季節活動'],
    bestTime: '平日開園時段或傍晚入園，避開連假人潮',
    history: (n, c) => `${n}是${c}的人氣休閒地標，結合遊憩、展演與學習，是全家出遊的熱門首選。`,
    desc: (n) => `${n}：大人小孩都玩得盡興的休閒地標。`,
  },
  food: {
    highlights: (n) => [`${n}的招牌在地小吃`, '排隊名店巡禮', '夜間熱鬧的市集氛圍'],
    bestTime: '傍晚 17:30 後至深夜，週末最熱鬧',
    history: (n, c) => `${n}匯集${c}的經典滋味，從古早味到創意小吃，一路吃出台灣常民生活的溫度。`,
    desc: (n) => `空著肚子來${n}，用味蕾認識在地生活。`,
  },
};

function hashString(str) {
  let h = 2166136261;
  for (const ch of str) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildSpots() {
  const counters = {};
  const nextCode = (cc) => {
    counters[cc] = (counters[cc] || 0) + 1;
    return `TW-${cc}-${String(counters[cc]).padStart(2, '0')}`;
  };

  const featured = FEATURED.map((f) => {
    const county = COUNTIES[f.cc];
    const code = nextCode(f.cc);
    return {
      ...f,
      id: code,
      code,
      featured: true,
      countyCode: f.cc,
      county: county.name,
      region: f.region || county.region,
      short: f.short || f.name,
      image: f.image || '',
    };
  });

  const generated = MORE.map(([name, nameEn, cc, category, lat, lng, alt, opts = {}]) => {
    const county = COUNTIES[cc];
    const t = TEMPLATES[category];
    const code = nextCode(cc);
    return {
      id: code,
      code,
      featured: false,
      name,
      short: opts.short || name,
      nameEn,
      cc,
      countyCode: cc,
      county: county.name,
      region: opts.region || county.region,
      category,
      lat,
      lng,
      altitude: alt <= 5 ? '海平面附近' : `約 ${alt.toLocaleString('zh-TW')} 公尺`,
      bestTime: t.bestTime,
      highlights: t.highlights(name),
      history: t.history(name, county.name),
      description: t.desc(name),
      rating: Math.round((4.2 + (hashString(name) % 70) / 100) * 10) / 10,
      foods: county.foods,
      image: opts.image || '',
    };
  });

  return [...featured, ...generated].slice(0, 100);
}

export const SPOTS = buildSpots();
export const TOTAL_SPOTS = SPOTS.length;
export const SPOT_MAP = Object.fromEntries(SPOTS.map((s) => [s.id, s]));

/** 依區域 → 縣市代碼 → 編號排序（集章冊網格用） */
const COUNTY_ORDER = Object.keys(COUNTIES);
export const SORTED_SPOTS = [...SPOTS].sort(
  (a, b) =>
    REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region) ||
    COUNTY_ORDER.indexOf(a.countyCode) - COUNTY_ORDER.indexOf(b.countyCode) ||
    a.code.localeCompare(b.code),
);

/* ------------------------------------------------------------------ */
/* 探索者榮譽頭銜                                                        */
/* ------------------------------------------------------------------ */
export const RANKS = [
  { min: 0, title: '台灣初探者', en: 'First-time Explorer', emoji: '🌱' },
  { min: 5, title: '寶島漫遊者', en: 'Island Wanderer', emoji: '🎒' },
  { min: 15, title: '縣市旅行家', en: 'County Traveler', emoji: '🧭' },
  { min: 30, title: '環島冒險王', en: 'Round-island Adventurer', emoji: '🚲' },
  { min: 50, title: '寶島達人', en: 'Formosa Expert', emoji: '🏮' },
  { min: 75, title: '台灣通', en: 'Taiwan Connoisseur', emoji: '🏯' },
  { min: 100, title: '福爾摩沙巡禮宗師', en: 'Grandmaster of Formosa', emoji: '👑' },
];

export function getRank(count) {
  return [...RANKS].reverse().find((r) => count >= r.min) || RANKS[0];
}
export function getNextRank(count) {
  return RANKS.find((r) => r.min > count) || null;
}
export function countStamps(stamps) {
  return Object.keys(stamps).filter((id) => SPOT_MAP[id]).length;
}
