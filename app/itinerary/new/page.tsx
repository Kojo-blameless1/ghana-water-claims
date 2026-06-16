'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ItineraryRow = {
  depPlace: string
  depDate: string
  depHour: string
  arrPlace: string
  arrDate: string
  arrHour: string
  mileageStandard: number
  mileageSubstandard: number
  radius: number
  conveyanceAmount: number
}

const emptyRow = (): ItineraryRow => ({
  depPlace: '', depDate: '', depHour: '',
  arrPlace: '', arrDate: '', arrHour: '',
  mileageStandard: 0, mileageSubstandard: 0,
  radius: 0, conveyanceAmount: 0,
})

export default function NewItinerary() {
  const router = useRouter()
  const [savedId, setSavedId] = useState<number | null>(null)
  const [rows, setRows] = useState<ItineraryRow[]>([emptyRow(), emptyRow(), emptyRow()])

  const addRow = () => setRows([...rows, emptyRow()])
  const removeRow = (idx: number) => {
    if (rows.length === 1) return
    setRows(rows.filter((_, i) => i !== idx))
  }
  const updateRow = (idx: number, field: keyof ItineraryRow, value: string | number) => {
    const updated = [...rows]
    updated[idx] = { ...updated[idx], [field]: value }
    setRows(updated)
  }

  const totalMileageStandard = rows.reduce((s, r) => s + (r.mileageStandard || 0), 0)
  const totalMileageSubstandard = rows.reduce((s, r) => s + (r.mileageSubstandard || 0), 0)
  const totalConveyance = rows.reduce((s, r) => s + (r.conveyanceAmount || 0), 0)

  const handleSave = async () => {
    const res = await fetch('/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries: rows }),
    })
    const data = await res.json()
    if (res.ok) setSavedId(data.id)
    else alert('Save failed: ' + (data.error || 'unknown'))
  }

  /* ── Success screen ── */
  if (savedId) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f0f4ff',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '48px 40px',
          textAlign: 'center', boxShadow: '0 4px 24px rgba(0,82,204,0.10)',
          maxWidth: 380, width: '100%', border: '1px solid #dce7ff',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#e8f0ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 28, color: '#0052cc',
          }}>✓</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0a2540', marginBottom: 8 }}>
            Itinerary Saved
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>
            The itinerary has been recorded successfully.
          </p>
          <button
            onClick={() => router.push(`/itinerary/${savedId}`)}
            style={{
              width: '100%', background: '#0052cc', color: '#fff', border: 'none',
              borderRadius: 8, padding: '11px 0', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', marginBottom: 10,
            }}
          >
            View &amp; Print Itinerary
          </button>
          <button
            onClick={() => setSavedId(null)}
            style={{
              width: '100%', background: 'transparent', color: '#0052cc',
              border: '1.5px solid #0052cc', borderRadius: 8, padding: '10px 0',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}
          >
            Enter Another
          </button>
        </div>
      </div>
    )
  }

  /* ── Shared styles ── */
  const cellInput: React.CSSProperties = {
    width: '100%', border: '1.5px solid #dce7ff', borderRadius: 5,
    padding: '5px 7px', fontSize: 12, outline: 'none',
    background: '#fff', color: '#0a2540', boxSizing: 'border-box',
  }
  const numInput: React.CSSProperties = { ...cellInput, textAlign: 'right' }

  const thGroup: React.CSSProperties = {
    background: '#0052cc', color: '#fff', fontWeight: 700,
    fontSize: 11, padding: '9px 8px', textAlign: 'center',
    border: '1px solid #0041a8', letterSpacing: '0.03em',
  }
  const thSub: React.CSSProperties = {
    background: '#1a6bff', color: '#fff', fontWeight: 500,
    fontSize: 10, padding: '6px 6px', textAlign: 'center',
    border: '1px solid #0041a8',
  }
  const td: React.CSSProperties = {
    border: '1px solid #dce7ff', padding: '4px 5px', verticalAlign: 'middle',
  }
  const tdDep: React.CSSProperties = { ...td, background: '#f8faff' }
  const tdArr: React.CSSProperties = { ...td, background: '#f0f4ff' }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── Nav bar ── */}
      <div style={{
        background: '#0052cc', padding: '0 32px',
        display: 'flex', alignItems: 'center', gap: 16,
        height: 60, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        <img src="/logo.png" alt="GWL" style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: 4 }} />
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.25)' }} />
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
            Ghana Water Limited
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
            Ashanti South Region
          </div>
        </div>
        <div style={{
          marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', color: '#fff',
          fontSize: 12, fontWeight: 600, padding: '4px 14px',
          borderRadius: 20, border: '1px solid rgba(255,255,255,0.3)',
        }}>
          Itinerary
        </div>
      </div>

      {/* ── Page body ── */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* Page heading */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0a2540', margin: 0 }}>
            New Itinerary
          </h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
            Enter each leg of the journey. Total mileage is calculated automatically.
          </p>
        </div>

        {/* ── Table card ── */}
        <div style={{
          background: '#fff', borderRadius: 12, border: '1px solid #dce7ff',
          boxShadow: '0 1px 8px rgba(0,82,204,0.06)', padding: '24px 28px', marginBottom: 20,
        }}>

          {/* Card header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #e8f0ff',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0052cc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Journey Entries
            </span>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
                <div style={{ width: 14, height: 14, background: '#f8faff', border: '1px solid #dce7ff', borderRadius: 3 }} />
                Departure
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
                <div style={{ width: 14, height: 14, background: '#f0f4ff', border: '1px solid #dce7ff', borderRadius: 3 }} />
                Arrival
              </div>
            </div>
            <span style={{
              background: '#e8f0ff', color: '#0052cc', fontSize: 11,
              fontWeight: 700, padding: '3px 10px', borderRadius: 20,
            }}>
              {rows.length} row{rows.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 980 }}>
              <thead>
                <tr>
                  <th style={{ ...thGroup, width: 28 }}>#</th>
                  <th style={thGroup} colSpan={3}>Departure From</th>
                  <th style={thGroup} colSpan={3}>Arrival At</th>
                  <th style={thGroup} colSpan={2}>Mileage</th>
                  <th style={thGroup}>Radius</th>
                  <th style={thGroup}>Means of Conveyance (GH¢)</th>
                  <th style={{ ...thGroup, width: 36 }}></th>
                </tr>
                <tr>
                  <th style={thSub}></th>
                  <th style={thSub}>Place</th>
                  <th style={thSub}>Date</th>
                  <th style={thSub}>Hour</th>
                  <th style={thSub}>Place</th>
                  <th style={thSub}>Date</th>
                  <th style={thSub}>Hour</th>
                  <th style={thSub}>Standard</th>
                  <th style={thSub}>Sub-standard</th>
                  <th style={thSub}></th>
                  <th style={thSub}></th>
                  <th style={thSub}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f8faff' }}>
                    {/* Row number */}
                    <td style={{ ...td, textAlign: 'center', color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>
                      {idx + 1}
                    </td>
                    {/* Departure */}
                    <td style={tdDep}>
                      <input value={row.depPlace} onChange={e => updateRow(idx, 'depPlace', e.target.value)} style={cellInput} placeholder="e.g. Kumasi" />
                    </td>
                    <td style={tdDep}>
                      <input type="date" value={row.depDate} onChange={e => updateRow(idx, 'depDate', e.target.value)} style={cellInput} />
                    </td>
                    <td style={tdDep}>
                      <input type="time" value={row.depHour} onChange={e => updateRow(idx, 'depHour', e.target.value)} style={cellInput} />
                    </td>
                    {/* Arrival */}
                    <td style={tdArr}>
                      <input value={row.arrPlace} onChange={e => updateRow(idx, 'arrPlace', e.target.value)} style={{ ...cellInput, background: 'transparent' }} placeholder="e.g. Obuasi" />
                    </td>
                    <td style={tdArr}>
                      <input type="date" value={row.arrDate} onChange={e => updateRow(idx, 'arrDate', e.target.value)} style={{ ...cellInput, background: 'transparent' }} />
                    </td>
                    <td style={tdArr}>
                      <input type="time" value={row.arrHour} onChange={e => updateRow(idx, 'arrHour', e.target.value)} style={{ ...cellInput, background: 'transparent' }} />
                    </td>
                    {/* Mileage */}
                    <td style={td}>
                      <input type="number" value={row.mileageStandard || ''} onChange={e => updateRow(idx, 'mileageStandard', parseFloat(e.target.value) || 0)} style={numInput} placeholder="0" />
                    </td>
                    <td style={td}>
                      <input type="number" value={row.mileageSubstandard || ''} onChange={e => updateRow(idx, 'mileageSubstandard', parseFloat(e.target.value) || 0)} style={numInput} placeholder="0" />
                    </td>
                    {/* Radius */}
                    <td style={td}>
                      <input type="number" value={row.radius || ''} onChange={e => updateRow(idx, 'radius', parseFloat(e.target.value) || 0)} style={numInput} placeholder="0" />
                    </td>
                    {/* Conveyance */}
                    <td style={td}>
                      <input type="number" step="0.01" value={row.conveyanceAmount || ''} onChange={e => updateRow(idx, 'conveyanceAmount', parseFloat(e.target.value) || 0)} style={numInput} placeholder="0.00" />
                    </td>
                    {/* Remove */}
                    <td style={{ ...td, textAlign: 'center' }}>
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(idx)}
                          title="Remove row"
                          style={{
                            background: '#fee2e2', border: 'none', borderRadius: 4,
                            color: '#dc2626', fontWeight: 700, fontSize: 14,
                            width: 24, height: 24, cursor: 'pointer', lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* ── Totals row ── */}
              <tfoot>
                <tr>
                  <td colSpan={7} style={{
                    border: '1px solid #dce7ff', padding: '8px 12px',
                    textAlign: 'right', fontWeight: 700, fontSize: 12,
                    color: '#0052cc', background: '#e8f0ff',
                    letterSpacing: '0.04em',
                  }}>
                    TOTAL MILEAGE
                  </td>
                  <td style={{ ...td, background: '#e8f0ff', textAlign: 'right', fontWeight: 700, color: '#0a2540', fontFamily: 'monospace' }}>
                    {totalMileageStandard.toFixed(2)}
                  </td>
                  <td style={{ ...td, background: '#e8f0ff', textAlign: 'right', fontWeight: 700, color: '#0a2540', fontFamily: 'monospace' }}>
                    {totalMileageSubstandard.toFixed(2)}
                  </td>
                  <td style={{ ...td, background: '#e8f0ff' }}></td>
                  <td style={{ ...td, background: '#e8f0ff', textAlign: 'right', fontWeight: 700, color: '#0052cc', fontFamily: 'monospace' }}>
                    GH¢ {totalConveyance.toFixed(2)}
                  </td>
                  <td style={{ ...td, background: '#e8f0ff' }}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Add row button */}
          <button
            type="button"
            onClick={addRow}
            style={{
              marginTop: 14, border: '1.5px dashed #0052cc', color: '#0052cc',
              background: 'transparent', fontSize: 12, fontWeight: 600,
              padding: '7px 18px', borderRadius: 6, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            + Add Row
          </button>
        </div>

        {/* ── Footer actions ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
            Signature fields appear on the printed itinerary only.
          </p>
          <button
            type="button"
            onClick={handleSave}
            style={{
              background: '#0052cc', color: '#fff', border: 'none',
              borderRadius: 8, padding: '12px 32px', fontWeight: 700,
              fontSize: 14, cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: 8,
              boxShadow: '0 4px 14px rgba(0,82,204,0.35)',
            }}
          >
            Save Itinerary →
          </button>
        </div>
      </div>
    </div>
  )
}