
import { getEventList } from "@/utils/ui/requests";
import { EventSelector } from "@/components/EventSelector";

const Page = async () => {
  const events = await getEventList();

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-bold">Select an Event</h1>
        <EventSelector events={events} />
      </div>
    </div>
  );
}

export default Page;
