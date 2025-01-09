"use client"
import { useRouter } from "next/navigation";

interface Props {
  items: { _id: string, name: string }[]
}

export const Selection = ({ items }: Props) => {
  const router = useRouter();

  const handleSelectionChange = (value: string) => {
    if (value) {
      router.push(`/event?id=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="selectOption" className="block text-sm font-medium mb-2">
        Choose an Event
      </label>
      <select
        id="selectOption"
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => handleSelectionChange(e.target.value)}
        defaultValue=""
      >
        <option disabled value="">
          Select an event
        </option>
        {
          items.map((item, idx) => (
            <option key={idx} value={item._id}>
              { item.name }
            </option>
          ))
        }
      </select>
    </div>
  )
}