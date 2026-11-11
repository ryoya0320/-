(() => {
  const levels=['基礎','標準','応用','発展','入試'];
  const units={1:[['math','正負の数'],['math','文字式'],['math','方程式'],['math','比例・反比例'],['japanese','漢字・語句'],['english','be動詞・一般動詞'],['science','植物・身近な物質'],['social','地理・歴史の基礎']],2:[['math','式の計算'],['math','連立方程式'],['math','一次関数'],['math','図形の性質'],['japanese','文法・読解'],['english','過去形・不定詞'],['science','化学変化・電流'],['social','日本地理・近世史']],3:[['math','展開・因数分解'],['math','平方根'],['math','二次方程式'],['math','二次関数'],['math','三平方の定理'],['japanese','評論・古文'],['english','現在完了・関係代名詞'],['science','イオン・運動'],['social','公民・現代史']]};
  function make(grade,index,level=1){
    level=Math.max(1,Math.min(5,Number(level)||1));const u=units[grade][index%units[grade].length],n=index+1,a=(index%30)+2,b=((index*7)%21)+1,d=levels[level-1];
    if(u[0]==='math'){
      if(level===1)return{id:`vg${grade}_${index}_${level}`,grade,subjectId:'math',unit:u[1],difficulty:d,level,type:'short',question:`${a}+${b}を計算しなさい。`,choices:[],answer:String(a+b),explanation:`${a}+${b}=${a+b}`};
      if(level===2)return{id:`vg${grade}_${index}_${level}`,grade,subjectId:'math',unit:u[1],difficulty:d,level,type:'short',question:`${a}x+${b}xを簡単にしなさい。`,choices:[],answer:`${a+b}x`,explanation:'同類項の係数を加えます。'};
      if(level===3)return{id:`vg${grade}_${index}_${level}`,grade,subjectId:'math',unit:u[1],difficulty:d,level,type:'short',question:`${a}x+${b}=${a*3+b}を満たすxを求めなさい。`,choices:[],answer:'3',explanation:`両辺から${b}を引き、${a}で割ります。`};
      if(level===4)return{id:`vg${grade}_${index}_${level}`,grade,subjectId:'math',unit:u[1],difficulty:d,level,type:'short',question:`連続する2整数の和が${2*a+1}です。小さい整数を求めなさい。`,choices:[],answer:String(a),explanation:`x+(x+1)=${2*a+1}として解きます。`};
      return{id:`vg${grade}_${index}_${level}`,grade,subjectId:'math',unit:u[1],difficulty:d,level,type:'short',question:`x²-${2*a}x+${a*a}=0を解きなさい。`,choices:[],answer:String(a),explanation:`(x-${a})²=0なのでx=${a}です。`};
    }
    const prompts={japanese:['語句の意味を選びなさい。','文脈に合う表現を選びなさい。','要旨として適切なものを選びなさい。','複数の条件を満たす説明を選びなさい。','記述・資料を踏まえ最適な解釈を選びなさい。'],english:['正しい英文を選びなさい。','時制が正しい英文を選びなさい。','文脈に合う英文を選びなさい。','複数の文法条件を満たす英文を選びなさい。','入試形式として最適な英文を選びなさい。'],science:['基本用語として正しいものを選びなさい。','実験結果として正しいものを選びなさい。','原因と結果の組合せを選びなさい。','複数の実験条件から結論を選びなさい。','未知の条件に知識を応用して選びなさい。'],social:['基本事項として正しいものを選びなさい。','資料に合う内容を選びなさい。','因果関係が正しいものを選びなさい。','複数資料から判断して選びなさい。','入試形式として最適な説明を選びなさい。']};
    const correct=`${d}レベルの適切な内容`;
    return{id:`vg${grade}_${index}_${level}`,grade,subjectId:u[0],unit:u[1],difficulty:d,level,type:'choice',question:`${prompts[u[0]][level-1]}（${grade}年・${u[1]}）`,choices:[correct,'条件に合わない内容A','条件に合わない内容B','条件に合わない内容C'].sort(()=>Math.random()-.5),answer:correct,explanation:`${d}レベルで必要な条件を順に確認します。`};
  }
  window.VIRTUAL_BANK={counts:{1:50000,2:50000,3:50000},units,levels,make};
})();
