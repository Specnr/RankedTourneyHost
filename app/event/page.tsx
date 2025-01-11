"use client"
import { Spinner } from "@/components/Spinner";
import { Container } from "@/components/Container";
import { BaseResults } from "@/utils/interfaces/Event";
import { getResultsFromEventId } from "@/utils/ui/requests";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 
import { SimpleResults } from "@/components/SimpleResults";

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

  console.log(data)

  return (
    <div className="w-full grid grid-cols-6 gap-4">
      <div className="col-start-2 col-span-4">
        <Container>
          <h1 className="text-2xl font-semibold mb-6 text-center">{ data.name }</h1>
          <SimpleResults results={data.results} />
        </Container>
      </div>
    </div>
  );
}
