/**
 * 场景模板数据 - 12个预设
 * 覆盖浪漫/紧张/悲伤/欢乐/神秘/震撼六大氛围
 * 支持现代/古代/未来三个时代
 */

export interface SceneTemplate {
  id: string;
  name: string;
  description: string;
  atmosphere: string;  // 氛围分类
  era: string;         // 时代
  location: string;    // 地点类型
  tags: string[];
  coverEmoji: string;
  coverGradient: string; // 渐变背景
  defaultData: {
    atmosphere: string;
    era: string;
    location: string;
    weather?: string;
    timeOfDay?: string;
    lighting: string;      // 光线描述
    soundDesign: string;   // 音效建议
    cameraAngle: string;   // 推荐镜头
    promptTemplate: string; // AI生成场景描述的模板
  };
}

export const sceneTemplates: SceneTemplate[] = [
  // ====== 浪漫氛围 (2个) ======
  {
    id: 'scene-rom-1',
    name: '天台日落告白',
    description: '金色夕阳洒满天台，城市尽收眼底，最适合告白的浪漫场景',
    atmosphere: '浪漫',
    era: '现代',
    location: '天台/露台',
    tags: ['热门', '告白', '日落', '城市'],
    coverEmoji: '🌅',
    coverGradient: 'linear-gradient(135deg, #ff6b9d 0%, #ffa751 100%)',
    defaultData: {
      atmosphere: '浪漫',
      era: '现代',
      location: '天台',
      weather: '晴天',
      timeOfDay: '黄昏',
      lighting: '金色暖光，逆光剪影效果',
      soundDesign: '远处城市车流声，风吹发丝声，心跳音效',
      cameraAngle: '低角度仰拍，捕捉夕阳剪影',
      promptTemplate: '现代都市天台，黄昏日落背景，金色阳光洒在两人身上，城市天际线，浪漫氛围',
    },
  },
  {
    id: 'scene-rom-2',
    name: '雨中咖啡厅对望',
    description: '落地窗外大雨滂沱，温暖的咖啡厅内两人隔桌对望，暧昧在空气中流动',
    atmosphere: '浪漫',
    era: '现代',
    location: '咖啡厅/餐厅',
    tags: ['暧昧', '雨天', '室内', '对望'],
    coverEmoji: '☕',
    coverGradient: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
    defaultData: {
      atmosphere: '浪漫',
      era: '现代',
      location: '咖啡厅',
      weather: '雨天',
      timeOfDay: '下午',
      lighting: '室内暖黄灯光，窗外雨水的冷光形成对比',
      soundDesign: '雨滴敲窗声，咖啡机蒸汽声，轻柔爵士乐',
      cameraAngle: '过肩镜头，焦点在两人眼神交汇',
      promptTemplate: '现代咖啡厅内景，落地窗外大雨，暖黄灯光，两人隔桌对望，浪漫暧昧氛围',
    },
  },

  // ====== 紧张氛围 (2个) ======
  {
    id: 'scene-tense-1',
    name: '手术室生死时速',
    description: '无影灯下医生全力抢救，监护仪滴滴作响，每一秒都关乎生死',
    atmosphere: '紧张',
    era: '现代',
    location: '医院/手术室',
    tags: ['医疗', '生死', '抢救', '高强度'],
    coverEmoji: '🏥',
    coverGradient: 'linear-gradient(135deg, #ff0000 0%, #7f0000 100%)',
    defaultData: {
      atmosphere: '紧张',
      era: '现代',
      location: '手术室',
      weather: '无',
      timeOfDay: '深夜',
      lighting: '无影灯冷白光，监护仪绿光闪烁',
      soundDesign: '监护仪滴滴声，手术器械碰撞声，医生急促指令',
      cameraAngle: '手持晃动镜头，特写医生额头的汗',
      promptTemplate: '现代医院手术室，无影灯下医生抢救，监护仪闪烁，紧张生死时速',
    },
  },
  {
    id: 'scene-tense-2',
    name: '大殿对峙生死局',
    description: '金碧辉煌的朝堂之上，两股势力剑拔弩张，一步走错满盘皆输',
    atmosphere: '紧张',
    era: '古代',
    location: '宫殿/大殿',
    tags: ['权谋', '对峙', '朝堂', '生死'],
    coverEmoji: '⚔️',
    coverGradient: 'linear-gradient(135deg, #FFD700 0%, #8B0000 100%)',
    defaultData: {
      atmosphere: '紧张',
      era: '古代',
      location: '大殿',
      weather: '无',
      timeOfDay: '白天',
      lighting: '大殿自然光从高处窗户射入，明暗对比强烈',
      soundDesign: '寂静中只有呼吸声，突然一声佩剑出鞘',
      cameraAngle: '广角展现大殿宏伟，缓慢推近主角面部',
      promptTemplate: '古代皇宫大殿，金碧辉煌，两股势力对峙，剑拔弩张，权谋生死局',
    },
  },

  // ====== 悲伤氛围 (2个) ======
  {
    id: 'scene-sad-1',
    name: '雨中车站离别',
    description: '冷雨夜的火车站，列车即将开动，两人隔着车窗手掌相贴，离别在即',
    atmosphere: '悲伤',
    era: '现代',
    location: '车站/机场',
    tags: ['离别', '雨天', '车站', '虐心'],
    coverEmoji: '🚂',
    coverGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    defaultData: {
      atmosphere: '悲伤',
      era: '现代',
      location: '火车站',
      weather: '雨夜',
      timeOfDay: '夜晚',
      lighting: '站台冷白荧光灯，车窗外昏黄灯光模糊',
      soundDesign: '火车汽笛声，雨声，广播模糊通知，压抑的抽泣',
      cameraAngle: '车窗反射拍摄，两人手掌隔着玻璃',
      promptTemplate: '现代火车站雨夜，站台冷光，火车车窗内外的离别，手掌相贴，悲伤氛围',
    },
  },
  {
    id: 'scene-sad-2',
    name: '长亭送别断肠时',
    description: '古道长亭，杨柳依依，送别之人挥泪策马而去，留下的人孤影伫立',
    atmosphere: '悲伤',
    era: '古代',
    location: '郊外/长亭',
    tags: ['送别', '古风', '孤寂', '虐心'],
    coverEmoji: '🍂',
    coverGradient: 'linear-gradient(135deg, #8B7355 0%, #556B2F 100%)',
    defaultData: {
      atmosphere: '悲伤',
      era: '古代',
      location: '长亭',
      weather: '秋风',
      timeOfDay: '黄昏',
      lighting: '夕阳斜照，拉长的影子，落叶飘零',
      soundDesign: '风声，马蹄声渐远，乌鸦叫声',
      cameraAngle: '远景长镜头，孤影伫立在长亭',
      promptTemplate: '古代长亭送别，秋风落叶，夕阳拉长的影子，孤寂悲伤，古风意境',
    },
  },

  // ====== 欢乐氛围 (2个) ======
  {
    id: 'scene-fun-1',
    name: '闺蜜聚会爆笑夜',
    description: '深夜大排档，几个闺蜜边吃边聊，笑声不断，是最放松的快乐时光',
    atmosphere: '欢乐',
    era: '现代',
    location: '街头/大排档',
    tags: ['闺蜜', '聚会', '搞笑', '夜生活'],
    coverEmoji: '🍻',
    coverGradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    defaultData: {
      atmosphere: '欢乐',
      era: '现代',
      location: '大排档',
      weather: '无',
      timeOfDay: '夜晚',
      lighting: '霓虹灯牌五颜六色，桌上暖光小灯串',
      soundDesign: '闺蜜爆笑声，碰杯声，街边嘈杂人声',
      cameraAngle: '俯拍圆桌，捕捉每个人表情',
      promptTemplate: '现代街头大排档夜景，霓虹灯牌，闺蜜聚会碰杯大笑，欢乐氛围',
    },
  },
  {
    id: 'scene-fun-2',
    name: '市井烟火逗趣集',
    description: '古代集市人声鼎沸，叫卖声此起彼伏，小孩追逐打闹，充满生活气息的欢乐',
    atmosphere: '欢乐',
    era: '古代',
    location: '集市/街巷',
    tags: ['市井', '集市', '古风', '烟火气'],
    coverEmoji: '🏪',
    coverGradient: 'linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)',
    defaultData: {
      atmosphere: '欢乐',
      era: '古代',
      location: '集市',
      weather: '晴天',
      timeOfDay: '白天',
      lighting: '自然日光，市集彩棚斑驳光影',
      soundDesign: '叫卖声，小孩笑声，鸡鸣狗吠，讨价还价',
      cameraAngle: '穿梭镜头，跟随主角在市集中穿行',
      promptTemplate: '古代繁华集市，人来人往叫卖声此起彼伏，烟火气息浓郁，欢乐古风场景',
    },
  },

  // ====== 神秘氛围 (2个) ======
  {
    id: 'scene-myst-1',
    name: '赛博废土暗巷',
    description: '霓虹灯在酸雨中闪烁，全息广告投射在潮湿的墙面上，一个神秘人影消失在暗巷尽头',
    atmosphere: '神秘',
    era: '未来',
    location: '城市暗巷',
    tags: ['赛博朋克', '废土', '暗巷', '悬疑'],
    coverEmoji: '🌃',
    coverGradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    defaultData: {
      atmosphere: '神秘',
      era: '未来',
      location: '暗巷',
      weather: '酸雨',
      timeOfDay: '夜晚',
      lighting: '霓虹灯闪烁，全息投影蓝紫色光，潮湿地面反光',
      soundDesign: '电子合成音，酸雨滴落，远处警笛，机械运转声',
      cameraAngle: '低角度广角，霓虹灯在雨水中拖影',
      promptTemplate: '赛博朋克废土城市，霓虹灯酸雨湿街，全息广告闪烁，暗巷神秘人影，未来悬疑',
    },
  },
  {
    id: 'scene-myst-2',
    name: '竹林秘境探秘',
    description: '幽深竹林中雾气缭绕，隐约可见一座破败的古庙，似乎有目光从暗处注视',
    atmosphere: '神秘',
    era: '古代',
    location: '野外/竹林',
    tags: ['竹林', '秘境', '古风', '悬疑'],
    coverEmoji: '🎋',
    coverGradient: 'linear-gradient(135deg, #0a3d0a 0%, #1a5c1a 50%, #0d3d0d 100%)',
    defaultData: {
      atmosphere: '神秘',
      era: '古代',
      location: '竹林',
      weather: '雾天',
      timeOfDay: '清晨',
      lighting: '雾气中透下的朦胧光束，竹叶上露珠反光',
      soundDesign: '竹叶沙沙声，远处古寺钟声，不明来源的低语',
      cameraAngle: '慢推镜头，雾气中逐渐显露的古庙轮廓',
      promptTemplate: '古代幽深竹林，雾气缭绕，破败古庙隐约可见，神秘悬疑古风场景',
    },
  },

  // ====== 震撼氛围 (2个) ======
  {
    id: 'scene-epic-1',
    name: '太空站绝境逃生',
    description: '地球在窗外缓缓旋转，太空站突然发生爆炸，宇航员在失重中生死逃生',
    atmosphere: '震撼',
    era: '未来',
    location: '太空/太空站',
    tags: ['太空', '科幻', '逃生', '大场面'],
    coverEmoji: '🚀',
    coverGradient: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
    defaultData: {
      atmosphere: '震撼',
      era: '未来',
      location: '太空站',
      weather: '无',
      timeOfDay: '无（太空）',
      lighting: '地球反射蓝光，爆炸火光，警报红光闪烁',
      soundDesign: '无声（太空），只有舱内警报和通讯杂音',
      cameraAngle: '360度旋转镜头，展现太空失重感',
      promptTemplate: '未来太空站，地球在窗外旋转，爆炸失重逃生，科幻震撼大场面',
    },
  },
  {
    id: 'scene-epic-2',
    name: '战场烽烟万箭齐发',
    description: '千军万马列阵以待，号角响起万箭齐发，天空中箭雨遮日，史诗级战争场面',
    atmosphere: '震撼',
    era: '古代',
    location: '战场/城外',
    tags: ['战争', '战场', '史诗', '大场面'],
    coverEmoji: '🏹',
    coverGradient: 'linear-gradient(135deg, #8B0000 0%, #2F4F4F 50%, #556B2F 100%)',
    defaultData: {
      atmosphere: '震撼',
      era: '古代',
      location: '战场',
      weather: '沙尘',
      timeOfDay: '黄昏',
      lighting: '战火映红天际，烟尘中逆光剪影',
      soundDesign: '战鼓声，万马奔腾，箭矢破空，喊杀震天',
      cameraAngle: '航拍全景推近，展现千军万马阵势',
      promptTemplate: '古代史诗战场，千军万马列阵，万箭齐发遮天蔽日，战火烽烟，震撼战争场面',
    },
  },
];
