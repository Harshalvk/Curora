"use client";

import UpdateUserApiKey from "@/actions/user/updateApiKey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader } from "lucide-react";
import React, { useState } from "react";

const ApiKeyPageContent = ({ apiKey }: { apiKey: string | null }) => {
  const [inputApi, setInputApi] = useState<string | null>(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const { mutate: updateApiKey, isPending } = useMutation({
    mutationFn: async () => {
      if (!inputApi) return;
      await UpdateUserApiKey(inputApi);
    },
  });

  return (
    <section className="p-3">
      <h1 className="mb-2 font-semibold sm:text-xl md:text-2xl">Api Key</h1>
      <div className="flex gap-3 items-center">
        <div className="w-full flex relative">
          <Input
            disabled={isPending}
            type={showApiKey ? "text" : "password"}
            defaultValue={apiKey ? apiKey : ""}
            placeholder="Enter your api key here"
            onChange={(e) => setInputApi(e.target.value)}
          />
          <Button
            aria-label="Toggle API visibility"
            title="Toggle API visibility"
            className="absolute right-0.5 top-0.5"
            onClick={() => setShowApiKey((prev) => !prev)}
            size={"sm"}
            variant={"ghost"}
          >
            {showApiKey ? <Eye /> : <EyeOff />}
          </Button>
        </div>

        <Button
          disabled={isPending}
          variant={"secondary"}
          onClick={() => updateApiKey()}
        >
          {isPending && <Loader className="h-3 w-3 animate-spin" />}
          Update
        </Button>
      </div>
    </section>
  );
};

export default ApiKeyPageContent;
