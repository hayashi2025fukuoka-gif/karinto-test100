
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import KarintoMaru from './components/KarintoMaru';
import ManjuIllustration from './components/ManjuIllustration';
import CelebrationCertificate from './components/CelebrationCertificate';
import { poems } from './data/poems';
import { manjuSteps } from './data/manjuSteps';
import { QuizState, PoemExplanation, CelebrationContent } from './types';
import { getPoemExplanation, getPoemHint, generateCelebrationPoem } from './services/geminiService';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>({
    pendingPoemIds: [],
    score: 0,
    showResult: false,
    selectedOption: null,
    shuffledOptions: [],
    isCorrect: null,
    manjuStep: 0,
  });
  const [explanation, setExplanation] = useState<PoemExplanation | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  
  // Celebration State
  const [isCelebrationLoading, setIsCelebrationLoading] = useState(false);
  const [celebrationContent, setCelebrationContent] = useState<CelebrationContent | null>(null);

  // 現在挑戦中の歌を取得
  const currentPoemId = quizState.pendingPoemIds[0];
  const currentPoem = poems.find(p => p.id === currentPoemId) || poems[0];

  const generateOptions = useCallback(() => {
    if (!gameStarted || quizState.pendingPoemIds.length === 0) return;

    const correct = currentPoem.shimunoku;
    const others = poems
      .filter((p) => p.id !== currentPoem.id)
      .map((p) => p.shimunoku);
    
    const shuffledWrong = others.sort(() => 0.5 - Math.random()).slice(0, 2);
    const combined = [correct, ...shuffledWrong].sort(() => 0.5 - Math.random());
    
    setQuizState((prev) => ({
      ...prev,
      shuffledOptions: combined,
      selectedOption: null,
      isCorrect: null,
      showResult: false,
    }));
    setExplanation(null);
    setHint(null);
  }, [gameStarted, currentPoem, quizState.pendingPoemIds.length]);

  useEffect(() => {
    if (gameStarted && quizState.pendingPoemIds.length > 0) {
      generateOptions();
    }
  }, [quizState.pendingPoemIds[0], generateOptions, gameStarted]);

  // 百首完遂時の自動祝賀フロー
  useEffect(() => {
    if (quizState.showResult && quizState.manjuStep === 100 && !celebrationContent && !isCelebrationLoading) {
      handleCelebration();
    }
  }, [quizState.showResult, quizState.manjuStep]);

  const checkApiKey = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    }
  };

  const handleStart = async (isPreview: boolean = false) => {
    await checkApiKey();
    
    let pendingIds: number[];
    let startStep = 0;

    if (isPreview) {
      // プレビューモード: 最後の一首
      pendingIds = [poems[99].id]; 
      startStep = 99;
    } else {
      // 通常モード: 全100首シャッフル
      pendingIds = poems.map(p => p.id).sort(() => 0.5 - Math.random());
      startStep = 0;
    }

    setQuizState({
      pendingPoemIds: pendingIds,
      score: startStep,
      showResult: false,
      selectedOption: null,
      shuffledOptions: [],
      isCorrect: null,
      manjuStep: startStep,
    });
    setGameStarted(true);
    setCelebrationContent(null);
  };

  const handleAnswer = (option: string) => {
    if (quizState.selectedOption) return;

    const isCorrect = option === currentPoem.shimunoku;
    setQuizState((prev) => ({
      ...prev,
      selectedOption: option,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
      manjuStep: isCorrect ? prev.manjuStep + 1 : prev.manjuStep
    }));
  };

  const fetchExplanation = async () => {
    setLoadingExplanation(true);
    const res = await getPoemExplanation(currentPoem);
    setExplanation(res);
    setLoadingExplanation(false);
  };

  const fetchHint = async () => {
    setLoadingHint(true);
    const res = await getPoemHint(currentPoem);
    setHint(res);
    setLoadingHint(false);
  };

  const handleCelebration = async () => {
    setIsCelebrationLoading(true);
    const poemData = await generateCelebrationPoem();
    
    if (poemData) {
      const now = new Date();
      const dateStr = `${now.getFullYear() - 2018}年${now.getMonth() + 1}月${now.getDate()}日`;
      setCelebrationContent({
        originalPoem: poemData.originalPoem,
        poemMeaning: poemData.poemMeaning,
        date: dateStr
      });
    }
    setIsCelebrationLoading(false);
  };

  const nextQuestion = () => {
    setQuizState((prev) => {
      const [finishedId, ...remainingIds] = prev.pendingPoemIds;
      
      if (prev.isCorrect) {
        if (remainingIds.length === 0) {
          return { ...prev, showResult: true, pendingPoemIds: [] };
        }
        return { ...prev, pendingPoemIds: remainingIds };
      } else {
        const newPending = [...remainingIds];
        const insertIndex = Math.floor(Math.random() * (newPending.length + 1));
        newPending.splice(insertIndex, 0, finishedId);
        return { ...prev, pendingPoemIds: newPending };
      }
    });
  };

  const currentManjuStep = manjuSteps[quizState.manjuStep - 1];
  const isLastPending = quizState.pendingPoemIds.length === 1;

  if (!gameStarted) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center flex-1 text-center py-8">
          <KarintoMaru 
            message="ようこそ！全百首を正解するまで終わらぬ『不退転の修練』へ。百首覚えた暁には、わたくし自ら祝賀の表彰状を授与させていただきますぞ。" 
            mood="happy"
          />
          <ManjuIllustration step={0} />
          <h1 className="text-6xl font-black mb-4 text-[#c04848] drop-shadow-md">雅</h1>
          <h2 className="text-3xl font-bold mb-8 tracking-widest text-[#2c1810]">百人一首・かりんとう饅頭修練</h2>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleStart(false)}
              className="px-12 py-4 miyabi-gradient text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ring-2 ring-[#d4af37] ring-offset-2"
            >
              修練を開始する
            </button>
            
            <button
              onClick={() => handleStart(true)}
              className="px-8 py-2 border-2 border-[#d4af37] text-[#d4af37] font-bold rounded-full hover:bg-[#d4af37] hover:text-white transition-all duration-300 text-sm"
            >
              【プレビュー】99首目から開始
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (quizState.showResult) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center flex-1 text-center py-4 w-full max-w-4xl">
          {isCelebrationLoading ? (
            <div className="flex flex-col items-center animate-pulse">
                <div className="w-24 h-24 mb-6">
                    <ManjuIllustration step={100} />
                </div>
                <KarintoMaru 
                    message="見事なり！今、秘伝の筆跡で『祝賀の表彰状』を認めておりますぞ。しばし、この余韻をお楽しみくだされ..." 
                    mood="thinking"
                />
            </div>
          ) : celebrationContent ? (
            <div className="w-full flex flex-col items-center pb-12">
                <div className="mb-12">
                   <CelebrationCertificate content={celebrationContent} />
                </div>
                <KarintoMaru 
                    message="全百首、誠にお見事でありました！この饅頭の如く、あなたの努力もまた、甘く香ばしく結実いたしましたな。わたくしも感無量でございます。" 
                    mood="happy"
                />
                <button
                    onClick={() => setGameStarted(false)}
                    className="mt-10 px-12 py-4 bg-[#c04848] text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                    目録へ戻る
                </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <KarintoMaru 
                message="あっぱれ！全百首を完璧に踏破し、伝説のかりんとう饅頭が完成いたしましたぞ！" 
                mood="happy"
              />
              <ManjuIllustration step={100} />
              <h2 className="text-4xl font-bold mb-6 text-[#c04848]">修練完遂</h2>
              <button
                onClick={handleCelebration}
                className="px-12 py-4 miyabi-gradient text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                表彰状を授与される
              </button>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full flex flex-col items-center flex-1 py-4">
        <div className="w-full flex justify-between items-end mb-1 px-4">
            <span className="text-xs font-bold text-[#c04848] bg-[#c04848]/10 px-2 py-0.5 rounded">
               作者：{currentPoem.author}
            </span>
            <span className="text-xs font-bold text-[#8c7a6b] italic">
              残り {quizState.pendingPoemIds.length} 首 ｜ {quizState.manjuStep} / 100 工程
            </span>
        </div>

        <div className="w-full bg-[#f0e6d2] h-4 rounded-full mb-6 overflow-hidden border border-[#d4af37]/30 shadow-inner mx-4">
          <div 
            className="h-full bg-gradient-to-r from-[#c04848] to-[#480048] transition-all duration-700 relative" 
            style={{ width: `${quizState.manjuStep}%` }}
          >
              <div className="absolute right-0 top-0 h-full w-4 bg-white/30 animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 w-full max-w-2xl justify-center px-4">
            <ManjuIllustration step={quizState.manjuStep} />
            <div className="flex-1 w-full flex flex-col items-center">
                <KarintoMaru 
                    message={hint || (quizState.selectedOption ? (quizState.isCorrect ? "あっぱれ！工程が進みましたぞ！" : "むむ、残念...後ほど再びお目にかかりますぞ。") : "対となる下の句を選んでくだされ。")}
                    mood={loadingHint ? 'thinking' : (quizState.selectedOption ? (quizState.isCorrect ? 'happy' : 'thinking') : 'encouraging')}
                />
                {!quizState.selectedOption && !hint && !loadingHint && (
                    <button 
                        onClick={fetchHint}
                        className="mt-[-20px] bg-white/80 text-[#8c7a6b] text-[10px] font-bold px-4 py-1 rounded-full border border-[#d4af37] shadow-sm hover:bg-[#d4af37] hover:text-white transition-colors"
                    >
                        💡 助言を乞う
                    </button>
                )}
            </div>
        </div>

        <div className="w-full max-w-2xl bg-white/60 border border-[#e6be8a] rounded-2xl p-8 mb-8 shadow-md relative overflow-hidden mx-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />
          <div className="flex justify-center items-center">
            <div className="japanese-vertical text-3xl font-bold leading-relaxed tracking-tighter text-[#2c1810] h-64 md:h-80 py-4">
              {currentPoem.kamunoku}
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl grid gap-4 px-4">
          {quizState.shuffledOptions.map((option, idx) => {
            const isSelected = quizState.selectedOption === option;
            const isCorrectOption = option === currentPoem.shimunoku;
            let bgColor = "bg-white hover:border-[#c04848] hover:shadow-md";
            let textColor = "text-[#2c1810]";

            if (quizState.selectedOption) {
              if (isCorrectOption) {
                bgColor = "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-100";
                textColor = "text-emerald-900";
              } else if (isSelected) {
                bgColor = "bg-rose-50 border-rose-400 ring-2 ring-rose-100";
                textColor = "text-rose-900";
              } else {
                bgColor = "bg-gray-50 border-gray-100 opacity-40";
              }
            }

            return (
              <button
                key={idx}
                disabled={!!quizState.selectedOption}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 text-lg font-serif shadow-sm flex items-center justify-between group ${bgColor} ${textColor}`}
              >
                <span className="flex-1">{option}</span>
                {quizState.selectedOption && isCorrectOption && (
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">正解</span>
                )}
                {quizState.selectedOption && isSelected && !isCorrectOption && (
                  <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold">再考</span>
                )}
              </button>
            );
          })}
        </div>

        {quizState.selectedOption && (
          <div className="mt-8 w-full max-w-xl flex flex-col items-center px-4">
            {quizState.isCorrect && currentManjuStep && (
                <div className="w-full bg-[#fdfaf1] border-2 border-dashed border-[#d4af37] p-4 rounded-xl mb-6 animate-in fade-in zoom-in duration-500 text-center">
                    <div className="font-bold text-[#c04848] text-sm mb-1">✦ 工程達成 ✦</div>
                    <div className="font-bold text-lg text-[#2c1810]">{currentManjuStep.title}</div>
                    <div className="text-xs text-[#5d4037] italic">{currentManjuStep.description}</div>
                </div>
            )}
            <div className="flex gap-4 w-full">
              {!explanation && (
                <button
                  onClick={fetchExplanation}
                  disabled={loadingExplanation}
                  className="flex-1 py-3 bg-[#d4af37] text-white rounded-lg font-bold shadow-md hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {loadingExplanation ? "AIが巻物を紐解いております..." : "歌の解説を見る"}
                </button>
              )}
              <button
                onClick={nextQuestion}
                className={`flex-1 py-3 ${quizState.isCorrect ? 'miyabi-gradient' : 'bg-[#8c7a6b]'} text-white rounded-lg font-bold shadow-md hover:scale-105 transition-transform`}
              >
                {quizState.isCorrect ? (isLastPending ? '終了' : '次の一首へ') : '修練を続ける'}
              </button>
            </div>
            {explanation && (
              <div className="mt-6 w-full p-6 bg-[#fffaf0] border border-[#d4af37] rounded-xl shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-bold text-[#c04848] mb-2 border-b-2 border-[#c04848]/20 pb-1 flex items-center gap-2">現代語訳</h3>
                <p className="text-md mb-6 leading-relaxed text-[#2c1810] font-serif">{explanation.translation}</p>
                <h3 className="text-lg font-bold text-[#c04848] mb-2 border-b-2 border-[#c04848]/20 pb-1 flex items-center gap-2">鑑賞の栞</h3>
                <p className="text-md leading-relaxed text-[#2c1810] font-serif">{explanation.appreciation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
