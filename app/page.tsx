import { Container } from "@/components/Container"
import { Selection } from "@/components/Selection"
import { getEventList } from "@/utils/ui/requests"

const Page = async () => {
  const events = await getEventList()
  console.log(events)

  return (
    <div className="w-full grid grid-cols-6 gap-4">
      <div className="col-start-2 col-span-4">
        <Container>
          <h1 className="text-2xl font-semibold mb-6 text-center">Ranked Tourney Host</h1>
          <Selection items={events} />
        </Container>
      </div>
    </div>
  )
}

export default Page