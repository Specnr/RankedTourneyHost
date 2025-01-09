"use client"
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react"; 

export default function TargetPage() {
  const router = useRouter()
  const searchParams = useSearchParams ()
  const eventId = searchParams.get("id")

  useEffect(() => {
    if (!eventId) {
      router.push("/")
    }
  }, [eventId, router])

  if (!eventId) {
    return null;
  }

  return (
    <div>
      <h1>Selected Event: {eventId}</h1>
    </div>
  );
}
