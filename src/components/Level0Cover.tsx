import { useLevel0Store } from '../store/level0Store';

export function Level0Cover() {
  const goToNarrative = useLevel0Store((s) => s.goToNarrative);

  return (
    <div
      className="h-full flex flex-col cursor-pointer select-none"
      onClick={goToNarrative}
    >
      {/* Cover image */}
      <div className="relative w-full flex-shrink-0 h-[60vh]">
        <img
          src="/assets/images/cover/chapter0.png"
          alt="序章封面"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#faf8f5]" />
      </div>

      {/* Chapter title */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <h1 className="font-serif text-5xl font-bold text-stone-800 tracking-[0.3em]">
          序章
        </h1>
        <p className="font-serif text-xl text-stone-500 tracking-[0.2em]">·</p>
        <p className="font-serif text-2xl text-stone-700 tracking-[0.5em]">
          惊梦
        </p>
      </div>

      {/* Click hint */}
      <p className="pb-10 text-center font-serif text-xs text-stone-500 tracking-widest animate-pulse">
        点击任意处继续
      </p>
    </div>
  );
}
