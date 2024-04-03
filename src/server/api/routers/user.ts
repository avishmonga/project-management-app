import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { hash } from "bcrypt";

export const userRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Ensure email uniqueness before creating the user
      const existingUser = await ctx.db.user.findFirst({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error("Email already in use");
      }

      // Hash the password
      const hashedPassword = await hash(input.password, 10); // 10 is the salt round

      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
      });

      return user;
    }),
});
