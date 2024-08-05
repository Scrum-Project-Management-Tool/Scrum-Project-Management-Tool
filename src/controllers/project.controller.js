import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";

const createNewProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  console.log(req.body);

  try {
    // create a new project
    const project = await Project.create({
      title,
      description,
    });

    // check if project was created by querying the database using the _id
    const createdProject = await Project.findById(project._id);

    if (!createdProject) {
      throw new ApiError(500, "Error creating project");
    }

    // If the project was created successfully, then assign the project to the creator right away
    const userId = req.user._id;

    const updateResult = await User.updateOne(
      { _id: userId },
      { $addToSet: { projectsId: createdProject._id } }, // Ensure the correct field name is used
      { new: true }
    );

    if (updateResult.nModified === 0) {
      throw new ApiError(500, "Error assigning project to creator");
    }

    // Update project's assignees field
    project.assignees = [`${userId}`];
    await project.save();

    // return response
    return res
      .status(201)
      .json(new ApiResponse(200, project, "project created successfully"));
  } catch (error) {
    throw new ApiError(500, "Error creating project : " + error.message);
  }
});

const assignProjectToUsers = asyncHandler(async (req, res) => {
  const { projectId, userEmails } = req.body;

  try {
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Get current assignees
    const currentAssignees = project.assignees.map((id) => id.toString());

    // Filter out user IDs that are already assigned to the project

    const assigneeEmails = await User.find({ email: { $in: userEmails } });

    const assigneeIds = assigneeEmails.map(user => user._id.toString()); 

    const newAssignees = assigneeIds.filter((id) => !currentAssignees.includes(id));

    // Only proceed if there are new assignees
    if (newAssignees.length > 0) {
      // Retrieve user documents to check for existing project assignments
      const users = await User.find({ _id: { $in: newAssignees } });

      // Filter out users who already have the project assigned
      const usersToUpdate = users.filter(
        (user) =>
          Array.isArray(user.projectsId) && !user.projectsId.includes(projectId)
      );

      // Update users' projectsId field if necessary
      if (usersToUpdate.length > 0) {
        const updateResult = await User.updateMany(
          { _id: { $in: usersToUpdate.map((user) => user._id) } },
          { $addToSet: { projectsId: projectId } },
          { new: true }
        );

        if (updateResult.nModified === 0) {
          throw new ApiError(500, "Error assigning project to users");
        }
      }

      // Update project's assignees field
      project.assignees = [...new Set([...project.assignees, ...newAssignees])]; // Ensure no duplicates
      await project.save();
    }

    // Return response
    return res
      .status(200)
      .json(new ApiResponse(200, "Project assigned to users successfully"));
  } catch (error) {
    console.error("Error assigning project to users:", error);
    throw new ApiError(
      500,
      "Error assigning project to users: " + error.message
    );
  }
});

const getAllAssignedProjects = asyncHandler(async (req, res) => {
  try {
    // Fetch the logged-in user ID from the request object
    const userId = req.user._id;

    // Find all projects assigned to the logged-in user
    const projects = await Project.find({ assignees: userId });

    // Check if any projects are found
    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, "No projects found for this user"));
    }

    // Return response with the found projects
    return res
      .status(200)
      .json(new ApiResponse(200, projects, "Projects fetched successfully"));
  } catch (error) {
    console.error("Error fetching assigned projects:", error);
    throw new ApiError(
      500,
      "Error fetching assigned projects: " + error.message
    );
  }
});

export { createNewProject, assignProjectToUsers, getAllAssignedProjects };
