import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function Home() {
  // Fetch recent 5 vouchers for quick access
  const recentVouchers = await prisma.travelVoucher.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      employee: true,
      date: true,
      totalAmount: true,
      createdAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with logo and company name */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <img src="/logo.png" alt="Ghana Water Logo" className="h-16 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              GHANA WATER LIMITED
            </h1>
            <p className="text-gray-600">
              Ashanti South Region – Travel & Claims Management System
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Cards for each form */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/travel-voucher/new" className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-8 border-blue-600">
              <h2 className="text-xl font-bold mb-2">
                ✈️ Travel Expense Voucher
              </h2>
              <p className="text-gray-600">
                Submit new travel claim, calculate expenses, and print form.
              </p>
            </div>
          </Link>

          <Link href="/summary-claims/new" className="block">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-8 border-green-600">
              <h2 className="text-xl font-bold mb-2">📊 Summary of Claims</h2>
              <p className="text-gray-600">
                Enter monthly summary per district with staff details.
              </p>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-8 border-gray-400 opacity-75">
            <h2 className="text-xl font-bold mb-2">📅 Weekly Activity Log</h2>
            <p className="text-gray-600">Log daily activities – coming soon.</p>
          </div>
        </div>

        {/* Recent Vouchers section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">📋 Recent Travel Vouchers</h2>
          {recentVouchers.length === 0 ? (
            <p className="text-gray-500">
              No vouchers yet. Create your first one above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Employee
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Total (GH¢)
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentVouchers.map((voucher: any) => (
                    <tr key={voucher.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{voucher.id}</td>
                      <td className="px-4 py-2 text-sm">{voucher.employee}</td>
                      <td className="px-4 py-2 text-sm">
                        {voucher.date || voucher.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {voucher.totalAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <Link
                          href={`/travel-voucher/${voucher.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View & Print
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-gray-500 text-sm">
          Ghana Water Limited – Ashanti South Region | Travel Expense Management
          System
        </div>
      </footer>
    </div>
  );
}
