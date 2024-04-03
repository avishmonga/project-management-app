import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { generateJWT, verifyJWT } from "~/utils/jwt";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const projectCount = await ctx.db.project.count({
        where: { createdById: ctx.session.user.id },
      });

      if (projectCount >= 2) {
        throw new Error("You have reached the maximum project limit");
      }
      // 2. Project Creation
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          createdById: ctx.session.user.id,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "admin",
            },
          },
        },
      });

      return project;
    }),
  addProjectMembers: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        emails: z.array(z.string().email()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // 1. Authorization (Ensure user is admin)
      const project = await ctx.db.project.findUnique({
        where: { id: input.projectId },
        include: { members: true },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      if (
        !project.members.some(
          (member) =>
            member.userId === ctx.session.user.id && member.role === "admin",
        )
      ) {
        throw new Error("You must be a project admin to add members");
      }

      // 2. Member Creation
      for (const email of input.emails) {
        const user = await ctx.db.user.findUnique({ where: { email } });

        const inviteToken = await generateJWT(
          { userId: user?.id, projectId: input.projectId },
          "5days",
        );
        const existingMembership = await ctx.db.projectMembership.findFirst({
          where: {
            projectId: input.projectId,
            userId: user?.id,
          },
        });

        if (existingMembership) {
          // Decide how to handle: throw an error, skip, or update role
          throw new Error(`User ${email} is already a member of this project`);
        }
        await ctx.db.projectMembership.create({
          data: {
            projectId: input.projectId,
            userId: user?.id, // User ID if they exist
            inviteToken,
            role: "member",
          },
        });

        // 3. Send Invitation Email
        if (user) {
          const inviteURL = `http://your-app.com/invite/${input.projectId}/${inviteToken}`;
          console.log(inviteURL);
          //   await sendEmail(
          //     email,
          //     "Project Invitation",
          //     `You have been invited to join project ${project.name}. Click here to accept: ${inviteURL}`,
          //   );
        } else {
          // Handle non-existing users (invite to sign up, etc.)
        }
      }
    }),
  joinProject: protectedProcedure
    .input(z.object({ projectId: z.number(), inviteToken: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // 1. Find Invitation & Validate against expiration
      const membership = await ctx.db.projectMembership.findUnique({
        where: {
          projectId: input.projectId,
          inviteToken: input.inviteToken,
        },
      });

      if (!membership?.inviteToken) {
        throw new Error("Invalid invite token or project");
      }

      // JWT Validation

      try {
        await verifyJWT(membership.inviteToken);
      } catch (err) {
        throw new Error("Invitation expired");
      }

      // 3. Update Membership Status
      await ctx.db.projectMembership.update({
        where: {
          projectId: input.projectId,
          inviteToken: input.inviteToken,
        },
        data: {
          status: "accepted",
          userId: ctx.session.user.id,
        },
      });

      // Send welcome email or other notifications
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findUnique({
      where: { id: 1 },
      include: { createdBy: true },
    });

    return {
      projects,
    };
  }),
});
