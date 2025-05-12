"use client";

import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
} from "react";
import { toast } from "sonner";

type Props = {
  chapter: Chapter;
  chapterIdx: number;
  completedChapters: Set<String>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
};

export type ChapterCardHandler = {
  triggerLoad: () => void;
};

const ChapterCard = forwardRef<ChapterCardHandler, Props>(
  ({ chapter, chapterIdx, setCompletedChapters, completedChapters }, ref) => {
    const [success, setSuccess] = useState<boolean | null>(null);
    const { mutate: getChapterInfo, isLoading } = useMutation({
      mutationFn: async () => {
        const response = await fetch("/api/chapter/getInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chapterId: chapter.id }),
        });
        return await response.json();
      },
      onMutate: () => {},
      onSuccess: () => {
        setSuccess(true);
        addChapterIdToSet();
        toast.success("Success");
      },
      onError: (error) => {
        console.log(error);
        setSuccess(false);
        toast.error("Error", {
          description: "There is an error loading your chapter.",
        });
        addChapterIdToSet();
      },
    });

    useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterIdToSet();
      }
    }, [chapter]);

    const addChapterIdToSet = useCallback(() => {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, completedChapters, setCompletedChapters]);

    useImperativeHandle(ref, () => ({
      async triggerLoad() {
        if (chapter.videoId) {
          addChapterIdToSet();
          return;
        }
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
        {isLoading && <Loader2 className="animate-spin transition-all" />}
      </div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;
