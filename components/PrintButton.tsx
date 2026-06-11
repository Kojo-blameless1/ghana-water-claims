'use client'
export default function PrintButton({ targetId }: { targetId: string }) {
  const handlePrint = () => {
    const printContent = document.getElementById(targetId)?.innerHTML
    const originalContent = document.body.innerHTML
    document.body.innerHTML = printContent || ''
    window.print()
    document.body.innerHTML = originalContent
    window.location.reload()
  }
  return <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Print Voucher</button>
}