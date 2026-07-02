/**
 * 剧情模板数据 - 10个预设
 * 覆盖甜宠/古装/悬疑/校园/逆袭/都市/科幻七大题材
 * 支持完整/开头/转折/结局四种结构
 */

export interface PlotTemplate {
  id: string;
  name: string;
  description: string;
  genre: string;        // 题材
  structure: string;     // 结构类型
  episodeCount: string;  // 集数范围
  tags: string[];
  coverEmoji: string;
  coverGradient: string;
  defaultData: {
    genre: string;
    structure: string;
    episodeCount: string;
    plotOutline: string;       // 剧情大纲
    keyPlotPoints: string[];   // 关键情节点
    characterArcs: string[];   // 角色弧光描述
    promptTemplate: string;     // AI生成剧情的模板
    episodeStructure: {         // 分集结构建议
      act1: string;  // 开局（前20%）
      act2: string;  // 发展（中间60%）
      act3: string;  // 高潮（后20%）
    };
  };
}

export const plotTemplates: PlotTemplate[] = [
  // ====== 甜宠恋爱 (2个) ======
  {
    id: 'plot-sweet-1',
    name: '契约婚姻变真爱',
    description: '先婚后爱的经典甜宠套路，从契约关系假戏真做，甜度爆表',
    genre: '甜宠恋爱',
    structure: '完整',
    episodeCount: '15-20集',
    tags: ['热门', '先婚后爱', '契约婚姻', '霸总'],
    coverEmoji: '💍',
    coverGradient: 'linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%)',
    defaultData: {
      genre: '甜宠恋爱',
      structure: '完整',
      episodeCount: '15-20集',
      plotOutline: '女主为救家族企业与男主签订契约婚姻，约定半年后离婚。相处中两人渐生情愫，男主先动心却不敢承认，女主后知后觉。最终在契约到期前，男主撕毁协议:"我不同意离婚。"',
      keyPlotPoints: [
        '第1集:女主家族企业危机，被迫签契约',
        '第3集:同居第一天，霸总生活细节反差萌',
        '第6集:女主遇险，男主失控般保护',
        '第10集:误会产生，两人冷战，男主首次失眠',
        '第14集:契约到期前夕，男主当众撕毁协议',
        '第18集:两人和解，第一次真心接吻',
      ],
      characterArcs: [
        '男主:从冷酷霸总→学会表达感情→为爱低头',
        '女主:从小心翼翼→找到自我价值→勇敢回应爱',
        '男二:默默守护→选择放手祝福',
      ],
      promptTemplate: '甜宠短剧，先婚后爱，契约婚姻假戏真做，霸总 slowly fall in love，15-20集完整故事弧光',
      episodeStructure: {
        act1: '契约签订+同居日常+暗生情愫（1-4集）',
        act2: '外部阻碍+误会产生+情感升温（5-14集）',
        act3: '危机爆发+真情告白+圆满结局（15-20集）',
      },
    },
  },
  {
    id: 'plot-sweet-2',
    name: '误惹霸总逃不掉',
    description: '一眼定情的霸总爱情开头，适合5集以内的高甜开篇',
    genre: '甜宠恋爱',
    structure: '开头',
    episodeCount: '3-5集',
    tags: ['开篇', '霸总', '误惹', '高甜'],
    coverEmoji: '💥',
    coverGradient: 'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)',
    defaultData: {
      genre: '甜宠恋爱',
      structure: '开头',
      episodeCount: '3-5集',
      plotOutline: '女主误闯男主私人场合（会议室/更衣室/私人电梯），两人初次交锋火药味十足。但男主却对这个"不怕死"的女人产生了兴趣，开始主动接近。',
      keyPlotPoints: [
        '第1集:误闯事件，两人初次交锋',
        '第2集:男主发现女主是自家公司新员工',
        '第3集:故意刁难实则暗中关注',
        '第4集:女主反击，男主心动而不自知',
        '第5集:留下悬念，为后续埋钩子',
      ],
      characterArcs: [
        '男主:初见嫌弃→暗中关注→主动接近',
        '女主:初见害怕→不服输→引起注意',
      ],
      promptTemplate: '甜宠短剧开篇，误闯事件引起霸总注意，3-5集高甜开头，留下悬念钩子',
      episodeStructure: {
        act1: '误闯事件+初次交锋（1-2集）',
        act2: '身份曝光+暗生情愫（3-4集）',
        act3: '悬念钩子+期待后续（第5集）',
      },
    },
  },

  // ====== 古装仙侠 (2个) ======
  {
    id: 'plot-xian-1',
    name: '王妃她不想干了',
    description: '古装轻喜剧，穿越王妃不断尝试"辞职"引发笑料，王爷从抗拒到离不开',
    genre: '古装仙侠',
    structure: '转折',
    episodeCount: '8-12集',
    tags: ['轻喜剧', '穿越', '王妃', '辞职'],
    coverEmoji: '👑',
    coverGradient: 'linear-gradient(135deg, #d4a574 0%, #f5e6ca 100%)',
    defaultData: {
      genre: '古装仙侠',
      structure: '转折',
      episodeCount: '8-12集',
      plotOutline: '现代社畜穿越成古代王妃，第一反应是"这班我不上了"。屡次尝试辞职/逃跑/被休，却每次都因意外事件被留下来。王爷从"赶紧走"到"不准走"，感情在笑料中悄然升温。',
      keyPlotPoints: [
        '第1-2集:穿越觉醒，递辞呈被拒',
        '第3-4集:逃跑计划屡败，每次都被王爷"意外"救下',
        '第5-6集:转折！王爷开始舍不得她走',
        '第7-8集:两人共同应对府中危机，感情升温',
        '第9-10集:她终于不想走了，王爷反而慌了',
      ],
      characterArcs: [
        '女主:社畜心态→找到归属感→主动选择留下',
        '王爷:嫌弃→习惯→离不开',
        '反派:府中老管家→被感化',
      ],
      promptTemplate: '古装轻喜剧，穿越王妃不断尝试辞职引发笑料，王爷从抗拒到离不开，8-12集转折篇',
      episodeStructure: {
        act1: '穿越觉醒+辞职尝试（1-3集）',
        act2: '逃跑失败+感情暗生（4-7集）',
        act3: '转折选择+圆满结局（8-12集）',
      },
    },
  },
  {
    id: 'plot-xian-2',
    name: '皇叔的心尖宠',
    description: '禁忌之恋的古装权谋爱情，腹黑皇叔vs天真少女，权力与爱情的博弈',
    genre: '古装仙侠',
    structure: '完整',
    episodeCount: '25-30集',
    tags: ['权谋', '禁忌恋', '皇叔', '大女主'],
    coverEmoji: '🏯',
    coverGradient: 'linear-gradient(135deg, #1e3a5f 0%, #4a90d9 100%)',
    defaultData: {
      genre: '古装仙侠',
      structure: '完整',
      episodeCount: '25-30集',
      plotOutline: '天真少女为查家族冤案接近权倾朝野的皇叔，却不知皇叔早已知晓她的目的却选择配合。两人在权力漩涡中互相试探、互相保护，最终皇叔为她负了天下。',
      keyPlotPoints: [
        '第1-5集:少女入京，设计接近皇叔',
        '第6-10集:皇叔配合演戏，两人暗生情愫',
        '第11-15集:身份曝光危机，两人关系破裂',
        '第16-20集:朝堂巨变，皇叔为护她选择废后',
        '第21-25集:冤案真相大白，两人联手反击',
        '第26-30集:天下与她，他选了她',
      ],
      characterArcs: [
        '女主:天真少女→智计无双→大女主',
        '皇叔:权倾天下→为爱负天下→找到软肋',
        '反派:摄政王→被反杀',
      ],
      promptTemplate: '古装权谋爱情，腹黑皇叔vs天真少女，禁忌之恋，权力与爱情博弈，25-30集完整故事',
      episodeStructure: {
        act1: '接近与试探（1-8集）',
        act2: '危机与抉择（9-18集）',
        act3: '反击与圆满（19-30集）',
      },
    },
  },

  // ====== 悬疑推理 (2个) ======
  {
    id: 'plot-sus-1',
    name: '消失的第七天',
    description: '高悬念悬疑开篇，女主醒来发现世界变了，所有人都说她已经死了七天',
    genre: '悬疑推理',
    structure: '开头',
    episodeCount: '3-5集',
    tags: ['悬疑', '烧脑', '开篇', '失踪'],
    coverEmoji: '🕵️',
    coverGradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    defaultData: {
      genre: '悬疑推理',
      structure: '开头',
      episodeCount: '3-5集',
      plotOutline: '女主从昏迷中醒来，发现日历显示今天是她"失踪"后的第七天。但她的记忆还停留在七天前。更诡异的是，镜中的自己身上有她不记得的伤痕...',
      keyPlotPoints: [
        '第1集:醒来发现时间不对，记忆断层',
        '第2集:查手机记录，发现七天内的通话记录但她完全没印象',
        '第3集:遇到一个说"你终于醒了"的神秘人',
        '第4集:发现自己的"死亡报道"新闻',
        '第5集:悬念：她到底经历了什么？',
      ],
      characterArcs: [
        '女主:困惑→恐惧→决心查真相',
        '神秘人:身份不明，似敌似友',
      ],
      promptTemplate: '悬疑短剧开篇，女主醒来发现消失七天，记忆断层，高悬念烧脑开头，3-5集',
      episodeStructure: {
        act1: '醒来发现异常（1集）',
        act2: '调查真相线索（2-4集）',
        act3: '悬念钩子（第5集）',
      },
    },
  },
  {
    id: 'plot-sus-2',
    name: '真凶原来是...',
    description: '悬疑剧高潮结局篇，所有线索汇聚，真凶身份震惊所有人',
    genre: '悬疑推理',
    structure: '结局',
    episodeCount: '3-5集',
    tags: ['悬疑', '反转', '结局', '真凶'],
    coverEmoji: '🔍',
    coverGradient: 'linear-gradient(135deg, #1a1a1a 0%, #8B0000 100%)',
    defaultData: {
      genre: '悬疑推理',
      structure: '结局',
      episodeCount: '3-5集',
      plotOutline: '所有嫌疑人齐聚一堂，侦探开始揭示真相。但真凶的身份将颠覆所有人的认知——最不可能的人是凶手。最后一刻还有惊天反转。',
      keyPlotPoints: [
        '第1集:所有嫌疑人被召集，回顾所有线索',
        '第2集:第一个"真凶"被指认，但出现破绽',
        '第3集:真正真凶暴露，动机令人唏嘘',
        '第4集:最后反转——真凶背后还有主谋',
        '第5集:正义得到伸张，但代价惨重',
      ],
      characterArcs: [
        '侦探:从迷茫→理清线索→揭示真相',
        '真凶:隐藏最深的人→动机曝光→令人唏嘘',
        '受害者家属:从仇恨→理解→放下',
      ],
      promptTemplate: '悬疑短剧结局篇，真凶身份反转，所有线索汇聚，震撼结局，3-5集',
      episodeStructure: {
        act1: '集结回顾（1集）',
        act2: '揭示真凶（2-3集）',
        act3: '最后反转+结局（4-5集）',
      },
    },
  },

  // ====== 校园青春 (1个) ======
  {
    id: 'plot-campus-1',
    name: '学霸的掌心娇',
    description: '校园甜宠，高冷学神被元气少女一步步融化，全校园都在嗑这对CP',
    genre: '校园青春',
    structure: '完整',
    episodeCount: '12-15集',
    tags: ['校园', '学霸', '甜宠', '青春'],
    coverEmoji: '🎓',
    coverGradient: 'linear-gradient(135deg, #3498db 0%, #a8e6cf 100%)',
    defaultData: {
      genre: '校园青春',
      structure: '完整',
      episodeCount: '12-15集',
      plotOutline: '全校第一的冷酷学神，没有人见他笑过。直到转学来的元气少女成了他的同桌，一切开始改变。她帮他找到了学习的乐趣之外的东西——快乐。',
      keyPlotPoints: [
        '第1-2集:元气少女转学，成了学神同桌',
        '第3-5集:学神被迫帮她补习，两人互动甜度升级',
        '第6-8集:校园活动合作，学神第一次笑了',
        '第9-11集:误会产生，两人疏远',
        '第12-13集:学神主动追回，告白名场面',
        '第14-15集:在一起后的校园甜蜜日常',
      ],
      characterArcs: [
        '学神:封闭内心→学会快乐→勇敢告白',
        '元气少女:暗恋→主动→被爱',
        '校园反派:校花→被感化→祝福',
      ],
      promptTemplate: '校园甜宠短剧，高冷学神被元气少女融化，12-15集完整青春爱情故事',
      episodeStructure: {
        act1: '相遇与摩擦（1-4集）',
        act2: '甜蜜与误会（5-10集）',
        act3: '告白与圆满（11-15集）',
      },
    },
  },

  // ====== 逆袭爽文 (1个) ======
  {
    id: 'plot-nixi-1',
    name: '废柴嫡女归来',
    description: '古装大女主逆袭，被庶妹陷害致死的嫡女重生归来，步步为营复仇',
    genre: '逆袭爽文',
    structure: '转折',
    episodeCount: '10-15集',
    tags: ['大女主', '重生', '复仇', '宅斗'],
    coverEmoji: '🔥',
    coverGradient: 'linear-gradient(135deg, #e67e22 0%, #c0392b 100%)',
    defaultData: {
      genre: '逆袭爽文',
      structure: '转折',
      episodeCount: '10-15集',
      plotOutline: '侯府嫡女被庶妹和未婚夫联手害死，重生回到三个月前。这一次，她不再善良可欺，开始布局反击。每一步都精准踩在敌人的软肋上。',
      keyPlotPoints: [
        '第1-2集:死亡回放，重生觉醒',
        '第3-5集:改变关键选择，避开第一次陷害',
        '第6-8集:转折！开始主动反击，宅斗高手上线',
        '第9-11集:揭露庶妹真面目，侯爷开始怀疑',
        '第12-13集:彻底击溃反派，拿回属于自己的一切',
        '第14-15集:找到真正的盟友/爱情',
      ],
      characterArcs: [
        '嫡女:善良可欺→腹黑高手→大女主',
        '庶妹:白莲花→真面目暴露→身败名裂',
        '侯爷:偏心→怀疑→后悔',
      ],
      promptTemplate: '古装大女主逆袭，嫡女重生复仇，宅斗爽文，10-15集转折篇',
      episodeStructure: {
        act1: '重生觉醒+避开陷害（1-5集）',
        act2: '主动反击+揭露真相（6-10集）',
        act3: '彻底逆袭+圆满结局（11-15集）',
      },
    },
  },

  // ====== 都市现实 (1个) ======
  {
    id: 'plot-city-1',
    name: '豪门弃妇逆袭记',
    description: '现代大女主逆袭，被豪门丈夫抛弃后涅槃重生，再见面她已是高高在上的商界女王',
    genre: '都市现实',
    structure: '完整',
    episodeCount: '20-25集',
    tags: ['大女主', '逆袭', '豪门', '商战'],
    coverEmoji: '👠',
    coverGradient: 'linear-gradient(135deg, #2c3e50 0%, #e74c3c 100%)',
    defaultData: {
      genre: '都市现实',
      structure: '完整',
      episodeCount: '20-25集',
      plotOutline: '豪门阔太被丈夫以"无法生育"为由离婚，净身出户。三年后，她以跨国集团CEO身份归来，前夫公司正面临破产危机...',
      keyPlotPoints: [
        '第1-3集:被离婚净身出户，众人嘲笑',
        '第4-8集:三年奋斗史（压缩闪回），建立自己的商业帝国',
        '第9-12集:以CEO身份回归，前夫公司陷入危机',
        '第13-17集:商战博弈，她步步为营',
        '第18-20集:前夫请求复合，她淡然拒绝',
        '第21-25集:找到真正懂她的人，圆满结局',
      ],
      characterArcs: [
        '女主:阔太→逆袭→商界女王',
        '前夫:嫌弃→后悔→求复合被拒',
        '真命天子:商业对手→合作伙伴→灵魂伴侣',
      ],
      promptTemplate: '都市大女主逆袭，豪门弃妇涅槃重生，商战爽文，20-25集完整故事',
      episodeStructure: {
        act1: '被弃与觉醒（1-5集）',
        act2: '奋斗与归来（6-15集）',
        act3: '反击与圆满（16-25集）',
      },
    },
  },

  // ====== 科幻未来 (1个) ======
  {
    id: 'plot-sci-1',
    name: '我下载了未来',
    description: '科幻悬疑开头，男主意外获得能看到未来的APP，但每次使用都有可怕代价',
    genre: '科幻未来',
    structure: '开头',
    episodeCount: '5-8集',
    tags: ['科幻', '悬疑', '未来', '开篇'],
    coverEmoji: '📱',
    coverGradient: 'linear-gradient(135deg, #0f0c29 0%, #00d2ff 100%)',
    defaultData: {
      genre: '科幻未来',
      structure: '开头',
      episodeCount: '5-8集',
      plotOutline: '普通社畜男主在手机上意外下载了一个没有开发者的APP，能显示未来24小时会发生的事。但每次查看未来，现实就会发生某种"代价"——一开始是小事，后来...',
      keyPlotPoints: [
        '第1集:意外下载APP，发现能看未来',
        '第2集:第一次使用，避免了被裁员的命运',
        '第3集:代价出现——他的猫意外走失了',
        '第4集:继续使用的诱惑太大，代价也越来越可怕',
        '第5集:发现APP的真正来源——未来自己的求救信号',
        '第6-8集:悬念——他必须决定要不要继续',
      ],
      characterArcs: [
        '男主:普通社畜→拥有超能力→发现恐怖真相',
        '未来男主:通过APP向过去求救',
        'APP:神秘存在，似敌似友',
      ],
      promptTemplate: '科幻悬疑短剧，男主下载能看到未来的APP，但有可怕代价，5-8集高悬念开头',
      episodeStructure: {
        act1: '获得能力（1-2集）',
        act2: '代价出现（3-5集）',
        act3: '真相线索（6-8集）',
      },
    },
  },
];
