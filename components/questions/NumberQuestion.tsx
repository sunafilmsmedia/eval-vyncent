"use client";

interface Props {
  value?: number;
  onChange: (v: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export default function NumberQuestion({
  value,
  onChange,
  min = 0,
  max = 60,
  step = 1,
  suffix = "ans",
}: Props) {
  const current = typeof value === "number" ? value : 0;
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-end gap-3">
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={typeof value === "number" ? value : ""}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") onChange(undefined);
              else onChange(Math.max(min, Math.min(max, Number(v))));
            }}
            placeholder="0"
            className="
              flex-1 font-serif text-5xl sm:text-6xl text-white bg-transparent
              placeholder:text-white/20 focus:outline-none w-full
            "
          />
          <span className="text-base text-slate-400 mb-2">{suffix}</span>
        </div>

        <div className="mt-6">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            onChange={(e) => onChange(Number(e.target.value))}
            className="
              w-full appearance-none h-1 rounded-full
              bg-gradient-to-r from-[var(--color-brand-700)] via-[var(--color-brand-400)] to-[var(--color-gold)]
              cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-[var(--color-brand-400)]
              [&::-webkit-slider-thumb]:shadow-[0_4px_14px_rgba(58,109,255,0.45)]
              [&::-webkit-slider-thumb]:cursor-grab
              [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--color-brand-400)]
            "
          />
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span>{min} an</span>
            <span>{max}+ ans</span>
          </div>
        </div>
      </div>
    </div>
  );
}
