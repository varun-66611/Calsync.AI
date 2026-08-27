import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getSubscriptionPlans, getUserActiveSubscription } from "./stripe";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Stripe subscription and payment routers
  stripe: router({
    // Get all active subscription plans
    plans: publicProcedure.query(async () => {
      return getSubscriptionPlans();
    }),

    // Get current user's subscription
    currentSubscription: protectedProcedure.query(async ({ ctx }) => {
      return getUserActiveSubscription(ctx.user.id);
    }),

    // Create checkout session
    createCheckoutSession: protectedProcedure
      .input(
        z.object({
          planId: z.number(),
          returnUrl: z.string().url(),
        })
      )
      .mutation(async (opts) => {
        // TODO: Implement Stripe checkout session creation
        // This will be called when user clicks "Get Started" on a pricing tier
        return {
          success: true,
          message: "Checkout session creation coming soon",
          userId: opts.ctx.user.id,
          planId: opts.input.planId,
        };
      }),

    // Handle subscription updates from Stripe webhooks
    handleWebhook: publicProcedure
      .input(
        z.object({
          type: z.string(),
          data: z.record(z.string(), z.unknown()),
        })
      )
      .mutation(async (opts) => {
        // TODO: Implement Stripe webhook handler
        // This will process subscription.updated, invoice.paid, etc.
        return {
          success: true,
          message: "Webhook processed",
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
