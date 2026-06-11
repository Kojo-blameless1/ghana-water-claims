import Link from 'next/link'
export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Ghana Water Claims System</h1>
      <ul className="mt-4 space-y-2">
        <li><Link href="/travel-voucher/new" className="text-blue-600 underline">Travel Expense Voucher</Link></li>
        {/* Other links will be added later */}
      </ul>
    </div>
  )
}