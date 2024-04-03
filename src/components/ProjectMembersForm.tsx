"use client";
import React from "react";

import { api } from "~/utils/api";

const ProjectMembersForm = () => {
  const mutation = api.project.addProjectMembers.useMutation();
  const handleClick = async () => {
    let projectId = 1;
    let emails = ["avish@retainwise.io", "avish@yahoo.com"];
    let response = await mutation.mutate({ projectId, emails });
    console.log(response);
  };
  return (
    <div>
      <button onClick={handleClick}> ADD project members</button>
    </div>
  );
};

export default ProjectMembersForm;
