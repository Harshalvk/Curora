"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Chapter, Question } from "@prisma/client";
import React, { useCallback, useState } from "react";

type Props = {
  chapter: Chapter & {
    questions: Question[];
  };
};

const QuizCards = ({ chapter }: Props) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionState, setQuestionState] = useState<
    Record<string, boolean | null>
  >({});

  const checkAnswer = useCallback(() => {
    console.log("clicked");
    const newQuestionState = { ...questionState };
    chapter.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (!userAnswer) return;
      if (userAnswer === question.answer) {
        newQuestionState[question.id] = true;
      } else {
        newQuestionState[question.id] = false;
      }
      setQuestionState(newQuestionState);
    });
  }, [answers, questionState, chapter.questions]);

  if (chapter.questions.length <= 0) return null;

  return (
    <div className="w-full mt-3">
      <h1 className="text-2xl font-semibold mb-1">Concept Check</h1>
      <div className="w-full grid grid-cols-2 gap-2">
        {chapter.questions.map((question) => {
          const options = JSON.parse(question.options) as string[];
          return (
            <div
              key={question.id}
              className={cn(
                "border rounded-md max-w-full p-2",
                questionState[question.id] === true &&
                  "bg-gradient-to-tr dark:from-zinc-950 to-green-400/20 border-green-300/20",
                questionState[question.id] === false &&
                  "bg-gradient-to-tr dark:from-zinc-950 to-red-400/20 border-red-300/20"
              )}
            >
              <h1 className="text-sm font-bold mb-2">{question.question}</h1>
              <div>
                <RadioGroup
                  onValueChange={(e) => {
                    setAnswers((prev) => {
                      return {
                        ...prev,
                        [question.id]: e,
                      };
                    });
                  }}
                >
                  {options.map((option, index) => (
                    <div className="flex items-center space-x-2" key={index}>
                      <RadioGroupItem
                        value={option}
                        id={question.id + index.toString()}
                      />
                      <Label htmlFor={question.id + index.toString()}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
      <Button
        className="w-full mt-2 cursor-pointer"
        variant={"secondary"}
        size={"lg"}
        onClick={() => checkAnswer()}
      >
        Check Answer
      </Button>
    </div>
  );
};

export default QuizCards;
