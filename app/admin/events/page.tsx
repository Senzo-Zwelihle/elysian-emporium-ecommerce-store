import React from "react";
import { unstable_noStore as noStore } from "next/cache";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

import { EventCalendarWrapper } from "@/components/event-calendar/calendar-wrapper";

import { fetchAllEvents } from "@/app/api/admin/event";

const EventsPage = async () => {
  noStore();
  const events = await fetchAllEvents();
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-md"}
      gap={"none"}
      flow={"none"}
      id="events"
      className="my-4"
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <Heading
          font={"aeonik"}
          size={"md"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"sm"}
        >
          Events
        </Heading>
      </div>
      {/* main */}
      <EventCalendarWrapper initialEvents={events} />
    </Container>
  );
};

export default EventsPage;
