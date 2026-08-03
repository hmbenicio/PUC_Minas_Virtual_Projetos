import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";

import "@/app/homeOn/task_Edit/edit.css"

function edit2({ formData, setFormData }) {
  return (
    <div className="personal-info-container">
      <Select className="personal-info-container input">
            <SelectTrigger
              placeholder="Selecione uma opção"
              style={{ color: "white", backgroundColor: '#ffbf00'}}
            >
              Equipe responsável
            </SelectTrigger>
            <SelectContent>
              {/* Utilizando SelectGroup para agrupar as opções */}
              <SelectGroup>
                <SelectItem value="option1">Opção 1</SelectItem>
              </SelectGroup>

              <SelectGroup>
                <SelectItem value="option3">Opção 2</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
    </div>
  );
}

export default edit2;