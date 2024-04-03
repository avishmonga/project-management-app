"use client";
import React, { useRef } from "react";
import { api } from "~/utils/api";

const ProjectForm = () => {
  const name = useRef("");
  const mutation = api.project.create.useMutation();
  const handleCreate = async () => {
    let response = await mutation.mutate({ name: name.current });
    console.log(response);
  };
  return (
    <div>
      <input
        onChange={(e) => (name.current = e.target.value)}
        type="text"
        placeholder="Enter project name"
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default ProjectForm;
