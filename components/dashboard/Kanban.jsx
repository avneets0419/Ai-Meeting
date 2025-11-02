"use client";

import { faker } from "@faker-js/faker";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const columns = [
  { id: faker.string.uuid(), name: "To Do", color: "#3B82F6", shadow:"rgba(59, 130, 246, 0.1)"},
  { id: faker.string.uuid(), name: "In Progress", color: "#F59E0B", shadow:"rgba(255,193,7,0.1)"},
  { id: faker.string.uuid(), name: "Completed", color: "#10B981",shadow:"rgba(16,185,129,0.1)" },
];

const users = Array.from({ length: 4 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
  }));

const exampleFeatures = Array.from({ length: 20 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
    startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
    endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
    column: faker.helpers.arrayElement(columns).id,
    owner: faker.helpers.arrayElement(users),
  }));

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const Kanban = () => {
  const [features, setFeatures] = useState(exampleFeatures);

  return (
    <KanbanProvider
      columns={columns}
      data={features}
      onDataChange={setFeatures}
    >
      {(column) => (
        <KanbanBoard id={column.id} key={column.id} shadowColor={column.shadow}>
          <KanbanHeader >
          <div className="flex items-center justify-between pr-1">
            <div className="flex items-center gap-2  py-2 px-1">
              
                
                <div
                className="h-2 w-2 rounded-full "
                style={{ backgroundColor: column.color }}
              />
              <span>{column.name}</span>
              
              </div>
              <PlusIcon className="h-5 w-5" style={{ color: column.color }}/>
            </div>
          </KanbanHeader>
          <KanbanCards id={column.id}>
            {(feature) => (
              <KanbanCard
                column={column.id}
                id={feature.id}
                key={feature.id}
                name={feature.name}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="m-0 flex-1 font-medium text-sm">
                      {feature.name}
                    </p>
                  </div>
                  {feature.owner && (
                    <Avatar className="h-4 w-4 shrink-0">
                      <AvatarImage src={feature.owner.image} />
                      <AvatarFallback>
                        {feature.owner.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="m-0 text-muted-foreground text-xs">
                  {shortDateFormatter.format(feature.startAt)} -{" "}
                  {dateFormatter.format(feature.endAt)}
                </p>
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
};

export default Kanban;
