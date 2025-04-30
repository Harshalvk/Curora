"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateChapterSchema } from "@/schema/course";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CreateCourseForm = () => {
  const form = useForm<z.infer<typeof CreateChapterSchema>>({
    resolver: zodResolver(CreateChapterSchema),
    defaultValues: {
      title: "",
      units: ["", "", ""],
    },
  });

  function onSubmit(values: z.infer<typeof CreateChapterSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the main topci of the course (e.g. 'Calculus')"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AnimatePresence>
          {form.watch("units").map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <FormField
                control={form.control}
                name={`units.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit {index + 1}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the subtopic of the course"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex items-center justify-center">
          <Separator className="flex-[1] hidden sm:block" />
          <div className="mx-4 space-x-2 flex">
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.setValue("units", [...form.watch("units"), ""]);
              }}
              className="text-xs"
            >
              Add Unit <PlusCircle className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.setValue("units", [...form.watch("units").slice(0, -1)]);
              }}
              className="text-xs"
            >
              Remove Unit <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <Separator className="flex-[1] hidden sm:block" />
        </div>
        <Button
          type="submit"
          variant={"secondary"}
          className="border w-full md:w-fit"
        >
          Let&apos;s go!
        </Button>
      </form>
    </Form>
  );
};

export default CreateCourseForm;
