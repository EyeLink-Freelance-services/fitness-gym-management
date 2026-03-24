"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui-elements/button";
import {
  AcceptTermsSchema,
  type AcceptTermsInput,
  type AcceptTermsValues,
} from "@/lib/validation/schemas/onboarding";

import { acceptInviteTermsAction } from "../actions";
import { OnboardingInviteRow } from "@/lib/db/types";

type Props = {
  rawToken: string;
  invite: OnboardingInviteRow;
};

export default function AcceptInviteTermsForm({ rawToken, invite }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptTermsInput, unknown, AcceptTermsValues>({
    resolver: zodResolver(AcceptTermsSchema),
    defaultValues: {
      token: invite.token,
      accepted_terms: false,
      accepted_privacy: false,
    },
  });

  const onSubmit = async (values: AcceptTermsValues) => {
    const res = await acceptInviteTermsAction(values);

    if (!res.ok) {
      console.error(res.message);
      return;
    }

    router.push(`/onboarding/auth?token=${rawToken}`);
  };

  const onError = (error: any) => {
    console.error(error, 'er')
  }

  return (
    <div className="rounded-[28px] border border-stroke bg-white p-6 shadow-theme-sm dark:border-dark-3 dark:bg-gray-dark sm:p-8">
      <div className="mb-8">
        <p className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Secure Onboarding
        </p>

        <h1 className="mb-2 text-2xl font-semibold text-dark dark:text-white sm:text-3xl">
          Welcome to your workspace setup
        </h1>

        <p className="text-sm text-dark-5">
          Before continuing, please review and accept the terms and privacy
          policy for using the application.
        </p>
      </div>

      <div className="mb-8 grid gap-4 rounded-2xl border border-stroke bg-gray-1 p-4 dark:border-dark-3 dark:bg-dark-2 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-dark-4">
            Invitation Email
          </p>
          <p className="text-sm font-medium text-dark dark:text-white">
            {invite.email}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-dark-4">
            Workspace Type
          </p>
          <p className="text-sm font-medium capitalize text-dark dark:text-white">
            {invite.invitation_type === "personal"
              ? "Personal Workspace"
              : "Company Workspace"}
          </p>
        </div>

        {invite.company_name && (
          <div className="sm:col-span-2">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-dark-4">
              Suggested Company Name
            </p>
            <p className="text-sm font-medium text-dark dark:text-white">
              {invite.company_name}
            </p>
          </div>
        )}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="space-y-4">
          <div className="rounded-2xl border border-stroke dark:border-dark-3">
            <div className="border-b border-stroke px-4 py-3 dark:border-dark-3">
              <h2 className="text-base font-semibold text-dark dark:text-white">
                Terms of Use
              </h2>
              <p className="mt-1 text-sm text-dark-5">
                Please read the terms that govern access to and use of the
                application.
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto px-4 py-4 text-sm leading-6 text-dark-5">
              <p className="mb-4">
                By accessing and using this application, you agree to use the
                platform only for lawful business purposes and in accordance
                with the rules communicated during onboarding.
              </p>

              <p className="mb-4">
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. Access to the platform is personal and may not be
                shared with unauthorized users.
              </p>

              <p className="mb-4">
                The application and its features are provided as part of the
                service made available to your workspace. We may improve,
                update, restrict, or discontinue certain features when required
                for operational, legal, or security reasons.
              </p>

              <p className="mb-4">
                You agree not to misuse the platform, attempt unauthorized
                access, interfere with service availability, or upload content
                that is unlawful, harmful, or violates the rights of others.
              </p>

              <p>
                Continued use of the application after activation means you
                agree to these terms and to any later updates that are properly
                communicated to you.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-stroke px-4 py-4 dark:border-dark-3">
            <input
              type="checkbox"
              {...register("accepted_terms")}
              className="mt-1 h-4 w-4 rounded border-stroke"
            />
            <div>
              <p className="text-sm font-medium text-dark dark:text-white">
                I accept the Terms of Use
              </p>
              <p className="mt-1 text-sm text-dark-5">
                I confirm that I have read and agree to the terms governing use
                of the application.
              </p>
            </div>
          </label>

          {errors.accepted_terms && (
            <p className="text-sm text-red">{errors.accepted_terms.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-stroke dark:border-dark-3">
            <div className="border-b border-stroke px-4 py-3 dark:border-dark-3">
              <h2 className="text-base font-semibold text-dark dark:text-white">
                Privacy Policy
              </h2>
              <p className="mt-1 text-sm text-dark-5">
                Please review how your information is collected and used.
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto px-4 py-4 text-sm leading-6 text-dark-5">
              <p className="mb-4">
                We collect and process information required to create your
                account, provide access to the platform, manage your workspace,
                and support the services offered through the application.
              </p>

              <p className="mb-4">
                This information may include personal details such as your name,
                email address, phone number, company details, and usage data
                necessary for security, support, and service improvement.
              </p>

              <p className="mb-4">
                We use appropriate technical and organizational measures to help
                protect your data. Access to personal information is limited to
                authorized persons and only where necessary for operational or
                support purposes.
              </p>

              <p className="mb-4">
                Your data is not shared outside the scope of the service except
                where necessary to operate the platform, comply with legal
                obligations, or protect legitimate business and security
                interests.
              </p>

              <p>
                By continuing, you acknowledge that you have read and understood
                this privacy policy and agree to the processing of your data as
                described.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-stroke px-4 py-4 dark:border-dark-3">
            <input
              type="checkbox"
              {...register("accepted_privacy")}
              className="mt-1 h-4 w-4 rounded border-stroke"
            />
            <div>
              <p className="text-sm font-medium text-dark dark:text-white">
                I accept the Privacy Policy
              </p>
              <p className="mt-1 text-sm text-dark-5">
                I understand how my personal data is collected, processed, and
                protected for use of the application.
              </p>
            </div>
          </label>

          {errors.accepted_privacy && (
            <p className="text-sm text-red">{errors.accepted_privacy.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-stroke pt-6 dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-dark-4">
            You must accept both documents before continuing to sign in or sign
            up.
          </p>

          <Button
            type="submit"
            label={isSubmitting ? "Continuing..." : "Continue"}
          />
        </div>
      </form>
    </div>
  );
}