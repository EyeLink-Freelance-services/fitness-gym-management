'use client'

import { redirect } from "next/navigation";
import { FormsTesting } from "../../components/Dashboard/FormsTesting";

import { getRedirectPathForAuth } from "@/lib/auth/permission";
import { useAuth } from "../context/auth-context";


export default function Home() {
  const auth = useAuth();
  const redirectPath = getRedirectPathForAuth(auth);
  if (redirectPath) {
    redirect(redirectPath);
  }

  return (
    <>
      
      <FormsTesting />
      

      {/* Measurement Testing */}


      {/* End Measurement Testing */}

      {/* <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <PaymentsOverview
          className="col-span-12 xl:col-span-7"
          key={extractTimeFrame("payments_overview")}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        />

        <WeeksProfit
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-5"
        />

        <UsedDevices
          className="col-span-12 xl:col-span-5"
          key={extractTimeFrame("used_devices")}
          timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
        />

        <RegionLabels />

        <div className="col-span-12 grid xl:col-span-8">
          <Suspense fallback={<Skeleton />}>
            <TableUI data={getTopChannels()} />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <ChatsCard />
        </Suspense>
      </div> */}
    </>
  );
}
