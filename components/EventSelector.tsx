'use client'
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Event } from "@/utils/interfaces/Event";

interface Props {
  events: Event[];
}

export const EventSelector = ({ events }: Props) => {
  const router = useRouter();

  const handleSelectionChange = (value: string) => {
    if (value) {
      router.push(`/event?id=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Select onValueChange={handleSelectionChange}>
        <SelectTrigger className="bg-secondary border-secondary h-12 text-lg">
          <SelectValue className="text-white" placeholder="Select an event" />
        </SelectTrigger>
        <SelectContent>
          {events.map((event) => (
            <SelectItem key={event._id} value={event._id}>
              {event.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};