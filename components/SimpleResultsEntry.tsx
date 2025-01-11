interface Props {
  ign: string
  place: number
  points: number | undefined
}

const getClassNameForPlace = (place: number) => {
  if (place === 1) {
    return "font-bold text-yellow-600"
  } else if (place === 2) {
    return "font-bold text-gray-400"
  } else if (place === 3) {
    return "font-bold text-orange-800"
  }
  return "font-semibold"
}

export const SimpleResultsEntry = ({ ign, place, points }: Props) => {
  return (
    <div className="col-span-5 text-lg">
      <span className={`${getClassNameForPlace(place)}`}>{ign}</span>
      {
        points !== undefined && (
          <span className="font-semibold"> - {points}</span>
        )
      }
    </div>
  )
}