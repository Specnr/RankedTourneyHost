"use client"
import { Spinner } from "@/components/Spinner";
import { BaseResults } from "@/utils/interfaces/Event";
import { getResultsFromEventId } from "@/utils/ui/requests";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 

export default function TargetPage() {
  const router = useRouter()
  const searchParams = useSearchParams ()
  const eventId = searchParams.get("id")
  const [data, setData] = useState<BaseResults | null>(null)

  useEffect(() => {
    if (!eventId) {
      router.push("/")
    }

    const fetchData = async () => {
      const resp = await getResultsFromEventId(eventId!)
      if (resp) {
        setData(resp)
      }
    }

    fetchData()
  }, [eventId, router])

  if (!data || !eventId) {
    return <Spinner />;
  }

  console.log(data.results)

  return (
    <div>
      <h1>Selected Event: {eventId}</h1>
    </div>
  );
}
