import React from "react";
import CreateCourseForm from "./_components/CreateCourseForm";
import AlertMessage from "@/components/Alert";

const CreateCourse = () => {
  return (
    <div className="p-4">
      <h1 className="mb-2 font-semibold sm:text-xl md:text-2xl">
        Create Course
      </h1>
      <div className="max-w-4xl mx-auto">
        <AlertMessage
          title="Important!"
          description="Provide a course title or the topic you want to explore. Then, list
            the units detailing what you want to learn. Our AI will create a
            tailored course for you!"
        />
        <div className="mt-3 border p-4 rounded-md">
          <CreateCourseForm />
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
