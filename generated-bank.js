(() => {
const levels=['基礎','標準','応用','発展','入試'];
const units={1:[['math','正負の数'],['math','文字式'],['math','方程式'],['math','比例・反比例'],['japanese','漢字・語句'],['english','be動詞・一般動詞'],['science','植物・身近な物質'],['social','地理・歴史の基礎']],2:[['math','式の計算'],['math','連立方程式'],['math','一次関数'],['math','図形の性質'],['japanese','文法・読解'],['english','過去形・不定詞'],['science','化学変化・電流'],['social','日本地理・近世史']],3:[['math','展開・因数分解'],['math','平方根'],['math','二次方程式'],['math','二次関数'],['math','三平方の定理'],['japanese','評論・古文'],['english','現在完了・関係代名詞'],['science','イオン・運動'],['social','公民・現代史']]};
const shuffle=(a,seed)=>a.map((v,i)=>({v,k:(seed*(i+3)*9301+49297)%233280})).sort((x,y)=>x.k-y.k).map(x=>x.v);
const choice=(base,seed)=>{const pool=[base.answer,...base.wrong].map(String),fallback=['0','1','-1','どれにも当てはまらない'];const unique=[...new Set(pool)];for(const x of fallback)if(unique.length<4&&!unique.includes(x))unique.push(x);const choices=shuffle(unique.slice(0,4),seed);return{...base,type:'choice',choices,explanation:base.explanation||`正解は「${base.answer}」です。`}};
function math(grade,unit,i,level){const a=i%9+2,b=i%7+1,d=levels[level-1];let q;
 if(unit==='正負の数')q={question:`${a}-(${b+3})を計算しなさい。`,answer:String(a-b-3),wrong:[String(a+b+3),String(b+3-a),String(a-b+3)],explanation:'かっこの前がマイナスなので、かっこ内の数を引きます。'};
 else if(unit==='文字式')q={question:`${a}x+${b}xを簡単にしなさい。`,answer:`${a+b}x`,wrong:[`${a*b}x`,`${a+b}x²`,`${a-b}x`],explanation:'同類項なので係数を加えます。'};
 else if(unit==='方程式')q={question:`${a}x+${b}=${a*3+b}のとき、xを求めなさい。`,answer:'3',wrong:['2','4',String(a)],explanation:`両辺から${b}を引き、${a}で割ります。`};
 else if(unit==='比例・反比例')q={question:`y=${a}xで、x=${b}のときのyを求めなさい。`,answer:String(a*b),wrong:[String(a+b),String(a-b),String(b)],explanation:`y=${a}×${b}です。`};
 else if(unit==='式の計算')q={question:`${a}(x+${b})を展開しなさい。`,answer:`${a}x+${a*b}`,wrong:[`${a}x+${b}`,`${a+b}x`,`${a*b}x`],explanation:'分配法則でかっこの中の各項に掛けます。'};
 else if(unit==='連立方程式')q={question:`x+y=${a+b}、x-y=${a-b}のとき、xを求めなさい。`,answer:String(a),wrong:[String(b),String(a+b),String(a-b)],explanation:'2式を加えると2xになります。'};
 else if(unit==='一次関数')q={question:`一次関数y=${a}x+${b}の傾きを答えなさい。`,answer:String(a),wrong:[String(b),String(a+b),String(-a)],explanation:'y=ax+bの傾きはxの係数aです。'};
 else if(unit==='図形の性質')q={question:'三角形の内角の和は何度ですか。',answer:'180度',wrong:['90度','270度','360度'],explanation:'三角形の内角の和は180度です。'};
 else if(unit==='展開・因数分解')q={question:`(x+${a})(x+${b})を展開しなさい。`,answer:`x²+${a+b}x+${a*b}`,wrong:[`x²+${a*b}x+${a+b}`,`x²+${a+b}x+${a+b}`,`x²+${a*b}`],explanation:'和と積を使って中項と定数項を求めます。'};
 else if(unit==='平方根')q={question:`√${a*a}の値を答えなさい。`,answer:String(a),wrong:[String(-a),String(a*a),`±${a}`],explanation:'√は0以上の平方根を表します。'};
 else if(unit==='二次方程式')q={question:`x²-${a+b}x+${a*b}=0を解きなさい。`,answer:`x=${a}, ${b}`,wrong:[`x=${a+b}`,`x=${a*b}`,`x=-${a}, -${b}`],explanation:`(x-${a})(x-${b})=0と因数分解します。`};
 else if(unit==='二次関数')q={question:`y=${a}x²でx=${b}のとき、yを求めなさい。`,answer:String(a*b*b),wrong:[String(a*b),String(a+b*b),String((a*b)**2)],explanation:`x²=${b*b}を代入します。`};
 else q={question:`直角をはさむ2辺が${3*a}cmと${4*a}cmの直角三角形の斜辺は何cmですか。`,answer:`${5*a}cm`,wrong:[`${7*a}cm`,`${4*a}cm`,`${6*a}cm`],explanation:'3:4:5の直角三角形をa倍した形です。'};
 return choice({...q,grade,subjectId:'math',unit,difficulty:d,level},i+level);}
const banks={
 japanese:{
 '漢字・語句':[
 {question:'「推敲」の意味として最も適切なものを選びなさい。',answer:'文章を何度も練り直すこと',wrong:['声に出して読むこと','要点だけを覚えること','資料を集めること']},
 {question:'「遵守」の読み方を選びなさい。',answer:'じゅんしゅ',wrong:['そんしゅ','じゅんじゅ','そんじゅ']},
 {question:'「簡潔」の意味として適切なものを選びなさい。',answer:'短く、要点がまとまっていること',wrong:['内容が複雑であること','感情が豊かであること','同じ表現を繰り返すこと']}],
 '文法・読解':[
 {question:'「静かな教室」の「静かな」の品詞を選びなさい。',answer:'形容動詞',wrong:['形容詞','連体詞','副詞']},
 {question:'文章の要旨をつかむとき、最も重視すべきものを選びなさい。',answer:'筆者が最も伝えたい中心的な内容',wrong:['最初に出てくる具体例','最も長い一文','知らない語句の数']}],
 '評論・古文':[
 {question:'評論文で「しかし」が示す関係を選びなさい。',answer:'前の内容と反対方向へ論を進める',wrong:['前の内容を言い換える','具体例を追加する','結論を繰り返す']},
 {question:'古文の「いと」の意味として一般的なものを選びなさい。',answer:'とても',wrong:['少し','すぐに','まったく～ない']},
 {question:'古文を読むとき、主語を判断する手がかりとして適切なものを選びなさい。',answer:'敬語や会話の前後関係',wrong:['文字数だけ','句読点の数だけ','現代語の語順だけ']}]
 },
 english:{
 'be動詞・一般動詞':[
 {question:'「私は中学生です。」に合う英文を選びなさい。',answer:'I am a junior high school student.',wrong:['I is a junior high school student.','I are a junior high school student.','I be a junior high school student.']},
 {question:'He (　) soccer every Sunday. に入る語を選びなさい。',answer:'plays',wrong:['play','playing','played']},
 {question:'Are you busy? に対する適切な答えを選びなさい。',answer:'Yes, I am.',wrong:['Yes, I do.','Yes, you are.','Yes, I is.']}],
 '過去形・不定詞':[
 {question:'I (　) to the library yesterday. に入る語を選びなさい。',answer:'went',wrong:['go','goes','going']},
 {question:'「私は英語を勉強するために図書館へ行った。」に合う英文を選びなさい。',answer:'I went to the library to study English.',wrong:['I went to the library study English.','I went to study the library English.','I to went the library studying English.']}],
 '現在完了・関係代名詞':[
 {question:'I (　) lived here for three years. に入る語を選びなさい。',answer:'have',wrong:['has','am','did']},
 {question:'This is the book (　) I bought yesterday. に入る語を選びなさい。',answer:'that',wrong:['who','where','when']},
 {question:'「彼はちょうど宿題を終えたところです。」に合う英文を選びなさい。',answer:'He has just finished his homework.',wrong:['He just finish his homework.','He has finish just his homework.','He did just finished his homework.']}]
 },
 science:{
 '植物・身近な物質':[
 {question:'植物の細胞にあり、動物の細胞にはないつくりを選びなさい。',answer:'葉緑体',wrong:['核','細胞膜','細胞質']},
 {question:'酸素の性質として正しいものを選びなさい。',answer:'ものを燃えやすくする',wrong:['石灰水を白くにごらせる','特有の刺激臭がある','水に非常によく溶ける']}],
 '化学変化・電流':[
 {question:'化学変化の前後で変わらないものを選びなさい。',answer:'原子の種類と数',wrong:['物質の性質','分子の組合せ','生成する物質の名称']},
 {question:'電圧6V、抵抗3Ωのとき、流れる電流を選びなさい。',answer:'2A',wrong:['0.5A','3A','18A']}],
 'イオン・運動':[
 {question:'原子が電子を失うと何になりますか。',answer:'陽イオン',wrong:['陰イオン','中性子','分子']},
 {question:'等速直線運動をしている物体の速さについて正しいものを選びなさい。',answer:'一定である',wrong:['次第に大きくなる','次第に小さくなる','必ず0になる']},
 {question:'塩酸中で水素イオンを表す化学式を選びなさい。',answer:'H⁺',wrong:['Cl⁻','OH⁻','Na⁺']}]
 },
 social:{
 '地理・歴史の基礎':[
 {question:'日本で最も面積が大きい都道府県を選びなさい。',answer:'北海道',wrong:['岩手県','長野県','福島県']},
 {question:'鎌倉幕府を開いた人物を選びなさい。',answer:'源頼朝',wrong:['足利尊氏','徳川家康','織田信長']}],
 '日本地理・近世史':[
 {question:'日本海側の冬の気候の特徴として適切なものを選びなさい。',answer:'季節風の影響で雪が多い',wrong:['一年中降水量が少ない','冬も高温で乾燥する','台風が毎週上陸する']},
 {question:'江戸幕府を開いた人物を選びなさい。',answer:'徳川家康',wrong:['豊臣秀吉','徳川吉宗','伊藤博文']}],
 '公民・現代史':[
 {question:'国の唯一の立法機関を選びなさい。',answer:'国会',wrong:['内閣','裁判所','地方自治体']},
 {question:'日本国憲法で行政権が属する機関を選びなさい。',answer:'内閣',wrong:['国会','最高裁判所','地方議会']},
 {question:'三権分立で司法権を担当する機関を選びなさい。',answer:'裁判所',wrong:['内閣','国会','選挙管理委員会']},
 {question:'冷戦終結の象徴とされる出来事を選びなさい。',answer:'ベルリンの壁の崩壊',wrong:['大政奉還','日清戦争','関ヶ原の戦い']},
 {question:'基本的人権の尊重について適切な説明を選びなさい。',answer:'人が生まれながらに持つ権利を大切にする',wrong:['国の命令を常に優先する','選挙権だけを保障する','成人だけの自由を認める']}]
 }};
function make(grade,index,level=1){level=Math.max(1,Math.min(5,Number(level)||1));const u=units[grade][index%units[grade].length];if(u[0]==='math')return math(grade,u[1],index,level);const arr=banks[u[0]][u[1]]||[];const source=arr[index%arr.length];return choice({...source,id:`real_${grade}_${u[0]}_${index}_${level}`,grade,subjectId:u[0],unit:u[1],difficulty:levels[level-1],level,explanation:source.explanation||`「${source.answer}」が正解です。`},index+level);}
window.VIRTUAL_BANK={counts:{1:50000,2:50000,3:50000},units,levels,make};
})();
