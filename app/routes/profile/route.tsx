import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Shell } from "~/components/shell";
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
  const joined = await prisma.user.findUnique({
    where: { id: user.id },
    select: { createdAt: true },
  });
  return { user, joined };
}

export const meta: MetaFunction = () => {
  return [{ title: "Account Settings - Remix Finance" }];
};

export const handle = {
  path: () => "/profile",
};
