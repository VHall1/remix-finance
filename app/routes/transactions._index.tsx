export default function Transactions() {
  return <p>testing</p>;
}

export const handle = { path: () => "/transactions" };

// <Button className="hidden sm:flex" variant="outline">
//   Today
// </Button>
// <Button className="hidden md:flex" variant="outline">
//   This Month
// </Button>
// <Popover>
//   <PopoverTrigger asChild>
//     <Button
//       className="w-[280px] justify-start text-left font-normal"
//       id="date"
//       variant="outline"
//     >
//       <CalendarClockIcon className="mr-2 h-4 w-4" />
//       June 01, 2023 - June 30, 2023
//     </Button>
//   </PopoverTrigger>
//   <PopoverContent align="end" className="w-auto p-0">
//     {/* <Calendar initialFocus mode="range" numberOfMonths={2} /> */}
//   </PopoverContent>
// </Popover>
