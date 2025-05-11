"use client";

import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useState, forwardRef, useImperativeHandle } from "react";
import { toast } from "sonner";

type Props = {
  chapter: Chapter;
  chapterIdx: number;
};

export type ChapterCardHandler = {
  triggerLoad: () => void;
};

const ChapterCard = forwardRef<ChapterCardHandler, Props>(
  ({ chapter, chapterIdx }, ref) => {
    const [success, setSuccess] = useState<boolean | null>(null);
    const { mutate: getChapterInfo, isLoading } = useMutation({
      mutationFn: async () => {
        const response = await fetch("/api/chapter/getInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        return await response.json();
      },
      onMutate: () => {},
      onSuccess: () => {
        toast.success("Success");
      },
      onError: () => {},
    });

    useImperativeHandle(ref, () => ({
      async triggerLoad() {
        getChapterInfo(undefined);
      },
    }));

    return (
      <div
        key={chapter.id}
        className={cn("border mt-1 p-2 rounded-md", {
          "dark:bg-neutral-900 bg-neutral-100": success === null,
          "bg-red-500/10": success === false,
          "bg-green-500/10": success === true,
        })}
      >
        <span className="text-muted-foreground">{chapterIdx + 1}.</span>{" "}
        {chapter.name}
      </div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;
