import { CoinChart } from '@/components/coin-chart'
import { Converter } from '@/components/converter'
import React from 'react'

const DeskTopChart = () => {
  return (
    <div className="flex max-lg:flex-col flex-1 gap-6 py-6 w-full max-w-7xl mx-auto">
            {/* Converter widget */}
            <div className="lg:order-1 lg:w-90 shrink-0">
              <Converter />
            </div>
            {/* Chart and table */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              <CoinChart />
         
            </div>
    </div>
  )
}

export default DeskTopChart
