import './StrandsBackground.css'

export default function StrandsBackground() {
  return (
    <div className="strands-background" aria-hidden="true">
      <div className="strands-grid" />
      <div className="strands-glow glow-one" />
      <div className="strands-glow glow-two" />
      <div className="strands-glow glow-three" />

      <svg className="strands-lines" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <path d="M-120 320C220 180, 360 160, 620 250S1080 420, 1420 270" />
        <path d="M-40 520C260 360, 420 420, 720 520S1160 660, 1640 500" />
        <path d="M-150 710C220 560, 430 560, 680 640S1120 780, 1660 640" />
      </svg>
    </div>
  )
}
