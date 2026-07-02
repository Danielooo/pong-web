type ScoreBoardProps = {
  leftScore: number
  rightScore: number
}

export function ScoreBoard({ leftScore, rightScore }: ScoreBoardProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center gap-16 text-5xl font-bold tracking-widest text-neutral-500 select-none">
      <span>{leftScore}</span>
      <span>{rightScore}</span>
    </div>
  )
}
