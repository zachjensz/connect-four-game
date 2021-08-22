import './slot.css'

interface Props {
  x: number
  y: number
  value: number
  onClick: (x: number, y: number) => any
}

export default function Slot({ x, y, value, onClick }: Props) {
  return (
    <div
      className='slot'
      data-x={x}
      data-y={y}
      data-value={value}
      onClick={() => onClick(x, y)}
    ></div>
  )
}
