import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { TopBooks } from '@/components/dashboard/top-books'
import { LowStockAlerts } from '@/components/dashboard/low-stock-alerts'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Recent Orders */}
        <RecentOrders />

        {/* Top Books */}
        <TopBooks />
      </div>

      {/* Low Stock Alerts */}
      <LowStockAlerts />
    </div>
  )
}