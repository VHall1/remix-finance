import { $Enums } from "@prisma/client";
import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Shell } from "~/components/shell";
import { handle as logoutHandle } from "~/routes/logout";
import { requireUser } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { ChangePasswordSection } from "./sections/change-password";
import { ProfileSection } from "./sections/profile";

export default function Profile() {
  return (
    <Shell>
      <div className="container mx-auto grid gap-6">
        <ProfileSection />
        <ChangePasswordSection />
      </div>
    </Shell>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const extraFields = await prisma.user
    .findUniqueOrThrow({
      where: { id: user.id },
      select: { createdAt: true, defaultCurrency: true },
    })
    .catch(() => {
      // TODO: this is shit. fix pls
      throw redirect(logoutHandle.path());
    });
  const { createdAt, defaultCurrency } = extraFields;

  return {
    user,
    joined: createdAt,
    defaultCurrency,
    currencyOptions: $Enums.Currency,
  };
}

export const meta: MetaFunction = () => {
  return [{ title: "Account Settings - Remix Finance" }];
};

export const handle = {
  path: () => "/profile",
};
