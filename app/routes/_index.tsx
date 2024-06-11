import { LoaderFunctionArgs } from "@remix-run/node";
import { Shell } from "~/components/shell";

export default function Dashboard() {
  // const { transactions } = useLoaderData<typeof loader>();

  return (
    <Shell>
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-xl">Dashboard</h1>
      </div>

      {/* <ResponsiveBar
        data={[
          {
            country: "AD",
            "hot dog": 145,
            "hot dogColor": "hsl(214, 70%, 50%)",
            burger: 140,
            burgerColor: "hsl(317, 70%, 50%)",
            sandwich: 0,
            sandwichColor: "hsl(105, 70%, 50%)",
            kebab: 114,
            kebabColor: "hsl(102, 70%, 50%)",
            fries: 93,
            friesColor: "hsl(72, 70%, 50%)",
            donut: 41,
            donutColor: "hsl(192, 70%, 50%)",
          },
          {
            country: "AE",
            "hot dog": 37,
            "hot dogColor": "hsl(244, 70%, 50%)",
            burger: 31,
            burgerColor: "hsl(258, 70%, 50%)",
            sandwich: 17,
            sandwichColor: "hsl(271, 70%, 50%)",
            kebab: 95,
            kebabColor: "hsl(160, 70%, 50%)",
            fries: 140,
            friesColor: "hsl(196, 70%, 50%)",
            donut: 60,
            donutColor: "hsl(20, 70%, 50%)",
          },
          {
            country: "AF",
            "hot dog": 29,
            "hot dogColor": "hsl(69, 70%, 50%)",
            burger: 192,
            burgerColor: "hsl(168, 70%, 50%)",
            sandwich: 193,
            sandwichColor: "hsl(80, 70%, 50%)",
            kebab: 85,
            kebabColor: "hsl(103, 70%, 50%)",
            fries: 164,
            friesColor: "hsl(333, 70%, 50%)",
            donut: 165,
            donutColor: "hsl(145, 70%, 50%)",
          },
          {
            country: "AG",
            "hot dog": 69,
            "hot dogColor": "hsl(356, 70%, 50%)",
            burger: 16,
            burgerColor: "hsl(195, 70%, 50%)",
            sandwich: 173,
            sandwichColor: "hsl(117, 70%, 50%)",
            kebab: 58,
            kebabColor: "hsl(295, 70%, 50%)",
            fries: 149,
            friesColor: "hsl(251, 70%, 50%)",
            donut: 144,
            donutColor: "hsl(290, 70%, 50%)",
          },
          {
            country: "AI",
            "hot dog": 36,
            "hot dogColor": "hsl(23, 70%, 50%)",
            burger: 23,
            burgerColor: "hsl(193, 70%, 50%)",
            sandwich: 67,
            sandwichColor: "hsl(320, 70%, 50%)",
            kebab: 79,
            kebabColor: "hsl(299, 70%, 50%)",
            fries: 30,
            friesColor: "hsl(250, 70%, 50%)",
            donut: 106,
            donutColor: "hsl(323, 70%, 50%)",
          },
          {
            country: "AL",
            "hot dog": 16,
            "hot dogColor": "hsl(297, 70%, 50%)",
            burger: 130,
            burgerColor: "hsl(181, 70%, 50%)",
            sandwich: 50,
            sandwichColor: "hsl(180, 70%, 50%)",
            kebab: 102,
            kebabColor: "hsl(171, 70%, 50%)",
            fries: 162,
            friesColor: "hsl(194, 70%, 50%)",
            donut: 32,
            donutColor: "hsl(32, 70%, 50%)",
          },
          {
            country: "AM",
            "hot dog": 64,
            "hot dogColor": "hsl(110, 70%, 50%)",
            burger: 93,
            burgerColor: "hsl(103, 70%, 50%)",
            sandwich: 166,
            sandwichColor: "hsl(0, 70%, 50%)",
            kebab: 48,
            kebabColor: "hsl(192, 70%, 50%)",
            fries: 2,
            friesColor: "hsl(154, 70%, 50%)",
            donut: 133,
            donutColor: "hsl(316, 70%, 50%)",
          },
        ]}
        keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: "fries",
            },
            id: "dots",
          },
          {
            match: {
              id: "sandwich",
            },
            id: "lines",
          },
        ]}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "country",
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "food",
          legendPosition: "middle",
          legendOffset: -40,
          truncateTickAt: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
          e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        }
      /> */}

      {/* <Card>
        <CardHeader className="gap-4 md:flex-row md:justify-between space-y-0">
          <CardTitle className="text-center">Recent transactions</CardTitle>
          <Button asChild>
            <Link to={transactionsHandle.path()}>
              View all
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:gap-2">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                {transaction.direction ===
                $Enums.TransactionDirection.INBOUND ? (
                  <ArrowUpIcon className="w-6 h-6 text-green-500" />
                ) : null}
                {transaction.direction ===
                $Enums.TransactionDirection.OUTBOUND ? (
                  <ArrowDownIcon className="w-6 h-6 text-red-500" />
                ) : null}
                <div className="ml-2">
                  <h3 className="font-semibold">Income</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Description of the transaction
                  </p>
                </div>
                <div className="ml-auto font-semibold">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "GBP",
                  }).format(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </Shell>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  // const user =
  await requireUser(request);
  // const recentTransactions = await prisma.transaction.findMany({
  //   where: { userId: user.id },
  //   orderBy: { createdAt: "desc" },
  //   take: 6,
  // });

  // return { transactions: recentTransactions };
  return null;
}
