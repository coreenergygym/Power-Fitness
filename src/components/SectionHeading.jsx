export default function SectionHeading({ eyebrow, title, text, align='left' }) {
  return <div className={`max-w-2xl ${align==='center' ? 'mx-auto text-center' : ''}`}>
    {eyebrow && <div className="eyebrow">{eyebrow}</div>}
    <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
    {text && <p className="mt-4 text-base leading-7 text-white/45">{text}</p>}
  </div>
}