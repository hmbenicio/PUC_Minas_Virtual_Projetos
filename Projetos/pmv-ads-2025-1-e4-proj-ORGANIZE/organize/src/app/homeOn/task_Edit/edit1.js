import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import "@/app/homeOn/task_Edit/edit.css"

function edit1({ formData, setFormData }) {
  return (
    <div className="sign-up-container flex flex-col gap-5">
       <Input
          placeholder="Título"
          type="text"
          className="my-5 lg:w-2/3 md:w-1/2 sm:w-1/2 w-1/2 md:text-base bg-[#ffbf00]"
        />
        <Textarea
          placeholder="Descrição"
          type="text"
          className="mb-5 lg:w-2/3 md:w-1/2 sm:w-1/2 w-1/2 md:text-base bg-[#ffbf00]"
        />
    </div>
  );
}

export default edit1;