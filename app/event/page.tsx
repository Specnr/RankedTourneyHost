"use client"
import { Spinner } from "@/components/Spinner";
import { Container } from "@/components/Container";
import { BaseResults, PageType } from "@/utils/interfaces/Event";
import { getResultsFromEventId } from "@/utils/ui/requests";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 
import { SimpleResults } from "@/components/SimpleResults";

export default function TargetPage() {
  const router = useRouter()
  const searchParams = useSearchParams ()
  const eventId = searchParams.get("id")
  const [data, setData] = useState<BaseResults | null>(null)
  const [pageType, setPageType] = useState<PageType>(PageType.Simple)

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
      <div className="col-span-6 md:col-start-2 md:col-span-4">
        <Container>
          <h1 className="text-2xl md:text-3xl font-semibold text-center">{ data.name }</h1>
          <div className="invisible h-0 md:h-fit md:visible md:my-4 text-xl grid grid-cols-2 divide-x divide-gray-700 text-center">
            <span onClick={() => setPageType(PageType.Simple)}
              className={`hover:underline ${pageType === PageType.Simple ? "font-bold" : null}`}>
              Simple
            </span>
            <span onClick={() => setPageType(PageType.Detailed)}
              className={`hover:underline ${pageType === PageType.Detailed ? "font-bold" : null}`}>
              Detailed
            </span>
            <span onClick={() => setPageType(PageType.PerRound)}
              className={`hover:underline ${pageType === PageType.PerRound ? "font-bold" : null}`}>
              Per Round
            </span>
          </div>
          <SimpleResults results={data.results} />
        </Container>
      </div>
    </div>
  );
}
