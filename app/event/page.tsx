"use client"
import { Spinner } from "@/components/Spinner";
import { Container } from "@/components/Container";
import { BaseResults, PageType } from "@/utils/interfaces/Event";
import { getResultsFromEventId } from "@/utils/ui/requests";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SimpleResults } from "@/components/Results/SimpleResults";
import { DetailedResults } from "@/components/Results/DetailedResults";
import { PerRoundResults } from "@/components/Results/PerRoundResults";

export default function TargetPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
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

  return (
    <div className="w-full grid grid-cols-6 gap-4">
      <div className="col-span-6 md:col-start-2 md:col-span-4">
        <Container>
          <h1 className="text-2xl md:text-3xl font-semibold text-center">{data.name}</h1>
          <div className="invisible h-0 md:h-fit md:visible md:my-4 text-xl grid grid-cols-3 divide-x divide-gray-700 text-center">
            <span onClick={() => setPageType(PageType.Simple)}
              className={`hover:font-bold ${pageType === PageType.Simple ? "font-bold" : null}`}>
              Simple
            </span>
            <span onClick={() => setPageType(PageType.Detailed)}
              className={`hover:font-bold ${pageType === PageType.Detailed ? "font-bold" : null}`}>
              Detailed
            </span>
            <span onClick={() => setPageType(PageType.PerRound)}
              className={`hover:font-bold ${pageType === PageType.PerRound ? "font-bold" : null}`}>
              Per Round
            </span>
          </div>
          {
            pageType === PageType.Simple && <SimpleResults results={data.results} />
          }
          {
            pageType === PageType.Detailed && <DetailedResults playerRoundData={data.playerRoundData} isUsingPoints={data.isUsingPoints} />
          }
          {
            pageType === PageType.PerRound && <PerRoundResults playerRoundData={data.playerRoundData} isUsingPoints={data.isUsingPoints} />
          }
        </Container>
      </div>
    </div>
  );
}
