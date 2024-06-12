import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { ChevronRight, LoaderCircleIcon, PlusIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { FormField } from "~/components/form-field";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { useIsDesktop } from "~/hooks/use-media-query";
import { addAccountSchema } from "~/schemas/account";
import { formatMoney } from "~/utils/money";
import { action, loader } from "./route";

export function AccountsCard() {
  const { accounts, totalBalance } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Your Balance</CardTitle>
        <CardDescription>
          Total balance: {formatMoney(totalBalance / 100)}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-3">
        <div className="grid">
          {accounts.map((account) => (
            <Button
              variant="ghost"
              className="h-12 py-0 px-6 rounded-none flex justify-between"
              key={account.id}
            >
              <div className="font-semibold flex items-center">
                {account.name}
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
              <span>{formatMoney(account.balance / 100)}</span>
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <AccountDialog>
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Add
          </Button>
        </AccountDialog>
      </CardFooter>
    </Card>
  );
}

function AccountDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const lastResult = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  useEffect(() => {
    // form submitted with no errors, can close dialog
    if (lastResult === null) {
      setOpen(false);
    }
  }, [lastResult]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add an account</DialogTitle>
          </DialogHeader>
          <AccountForm>
            <DialogFooter>
              <Button
                name="intent"
                value="add-account"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Done
              </Button>
            </DialogFooter>
          </AccountForm>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add an account</DrawerTitle>
        </DrawerHeader>
        <AccountForm>
          <DrawerFooter>
            <Button
              name="intent"
              value="add-account"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Done
            </Button>
          </DrawerFooter>
        </AccountForm>
      </DrawerContent>
    </Drawer>
  );
}

function AccountForm({ children }: { children: ReactNode }) {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: addAccountSchema });
    },
    shouldValidate: "onInput",
  });

  return (
    <Form method="post" id={form.id} onSubmit={form.onSubmit} noValidate>
      <div className="grid gap-4 px-4 md:px-0 md:py-4">
        <FormField
          field={fields.name}
          label="Name"
          placeholder="Enter account name"
          required
        />
        <FormField
          field={fields.balance}
          label="Balance"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter account starting balance"
          required
        />
      </div>
      {children}
    </Form>
  );
}
