import { useState } from 'react'

export default function Brand({ compact = false }) {
  const [broken, setBroken] = useState(false)
  return (
    <div className="flex items-center gap-3">
      {!broken ? (
        <img src="/assets/images/logo.svg" alt="Power Fitness logo" onError={() => setBroken(true)}
          className={`${compact ? 'h-9' : 'h-11'} w-auto object-contain`} />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center border border-power-400/40 bg-power-400/10 text-sm font-black text-power-300">PF</div>
      )}
      <div className="leading-none">
        <div className="font-display text-sm font-bold tracking-[.16em] text-white">POWER FITNESS</div>
        {!compact && <div className="mt-1 text-[9px] font-medium tracking-[.18em] text-white/40">HEALTH CLUB GYM</div>}
      </div>
    </div>
  )
}