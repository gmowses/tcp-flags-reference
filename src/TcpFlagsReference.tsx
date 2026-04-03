import { useState, useEffect } from 'react'
import { Sun, Moon, Languages, Activity } from 'lucide-react'

const translations = {
  en: {
    title: 'TCP Flags Reference',
    subtitle: 'Interactive TCP flags, visual header diagram, and common flag combinations. Everything client-side.',
    flags: 'TCP Flags',
    header: 'Header Diagram',
    combinations: 'Common Combinations',
    flagName: 'Flag',
    bit: 'Bit',
    description: 'Description',
    hexValue: 'Hex',
    clickFlag: 'Click a flag to highlight it in the header.',
    combo: 'Combination',
    scenario: 'Scenario',
    notes: 'Notes',
    builtBy: 'Built by',
  },
  pt: {
    title: 'Referencia de Flags TCP',
    subtitle: 'Flags TCP interativos, diagrama do cabecalho e combinacoes comuns. Tudo no navegador.',
    flags: 'Flags TCP',
    header: 'Diagrama do Cabecalho',
    combinations: 'Combinacoes Comuns',
    flagName: 'Flag',
    bit: 'Bit',
    description: 'Descricao',
    hexValue: 'Hex',
    clickFlag: 'Clique em uma flag para destacar no cabecalho.',
    combo: 'Combinacao',
    scenario: 'Cenario',
    notes: 'Notas',
    builtBy: 'Criado por',
  },
} as const

type Lang = keyof typeof translations

interface TcpFlag {
  name: string
  bit: number
  hex: string
  shortDesc: string
  longDesc: string
  color: string
}

const TCP_FLAGS: TcpFlag[] = [
  { name: 'CWR', bit: 7, hex: '0x80', shortDesc: 'Congestion Window Reduced', longDesc: 'Sent by the sender to acknowledge receipt of an ECE-flagged segment, reducing its congestion window. Part of ECN (RFC 3168).', color: '#6366f1' },
  { name: 'ECE', bit: 6, hex: '0x40', shortDesc: 'ECN-Echo', longDesc: 'Indicates ECN-capable transport. If SYN=1, the sender supports ECN. If SYN=0, a congestion-experienced CE was received. RFC 3168.', color: '#8b5cf6' },
  { name: 'URG', bit: 5, hex: '0x20', shortDesc: 'Urgent Pointer valid', longDesc: 'The Urgent Pointer field is significant. Rarely used in modern TCP stacks, but telnet uses it for out-of-band signaling.', color: '#ec4899' },
  { name: 'ACK', bit: 4, hex: '0x10', shortDesc: 'Acknowledgment field valid', longDesc: 'The Acknowledgment Number field is valid. Set in all packets after the initial SYN. Essential for reliable delivery.', color: '#3b82f6' },
  { name: 'PSH', bit: 3, hex: '0x08', shortDesc: 'Push function', longDesc: 'Requests the receiver to deliver data to the application immediately (do not buffer). Common in interactive protocols like HTTP.', color: '#10b981' },
  { name: 'RST', bit: 2, hex: '0x04', shortDesc: 'Reset the connection', longDesc: 'Abruptly terminates a connection. Sent when a segment arrives for a non-existent or closed port, or to abort a connection.', color: '#ef4444' },
  { name: 'SYN', bit: 1, hex: '0x02', shortDesc: 'Synchronize sequence numbers', longDesc: 'Used in the 3-way handshake to initiate a connection. Only the first packet should have SYN=1, ACK=0.', color: '#f59e0b' },
  { name: 'FIN', bit: 0, hex: '0x01', shortDesc: 'No more data from sender', longDesc: 'Initiates graceful connection teardown. The sender has no more data to send. A FIN/ACK exchange occurs in each direction.', color: '#06b6d4' },
]

interface Combo {
  flags: string[]
  scenario: string
  notes: string
}

const COMBOS: Combo[] = [
  { flags: ['SYN'], scenario: '3-way handshake — Step 1', notes: 'Client → Server: initiate connection, no ACK' },
  { flags: ['SYN', 'ACK'], scenario: '3-way handshake — Step 2', notes: 'Server → Client: accept, acknowledge SYN' },
  { flags: ['ACK'], scenario: '3-way handshake — Step 3 / Data ACK', notes: 'Client → Server: connection established. Also used for every data ACK.' },
  { flags: ['PSH', 'ACK'], scenario: 'Data transfer', notes: 'Most common in HTTP/HTTPS: data pushed to app layer immediately' },
  { flags: ['FIN', 'ACK'], scenario: 'Graceful teardown — Step 1', notes: 'One side signals no more data. Repeated in the other direction.' },
  { flags: ['RST'], scenario: 'Abort (port closed)', notes: 'Received a packet for a non-listening port or illegal state' },
  { flags: ['RST', 'ACK'], scenario: 'Abort (mid-connection)', notes: 'Abrupt teardown acknowledging the last received sequence' },
  { flags: ['SYN', 'RST'], scenario: 'Illegal combination', notes: 'Invalid — used in firewall evasion scanning, should be dropped' },
  { flags: ['URG', 'PSH', 'FIN'], scenario: 'Xmas scan (nmap)', notes: 'Port scanning technique — all three unusual flags set simultaneously' },
  { flags: ['ECE', 'SYN'], scenario: 'ECN handshake', notes: 'SYN with ECE=1 indicates ECN-capable transport (RFC 3168)' },
  { flags: ['CWR', 'ACK'], scenario: 'Congestion signal ACK', notes: 'Sender reduces congestion window after receiving ECE' },
]

export default function TcpFlagsReference() {
  const [lang, setLang] = useState<Lang>(() => (navigator.language.startsWith('pt') ? 'pt' : 'en'))
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<'flags' | 'header' | 'combinations'>('flags')

  const t = translations[lang]
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  const selectedFlag = TCP_FLAGS.find(f => f.name === selected)

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <span className="font-semibold">TCP Flags Reference</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/tcp-flags-reference" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="flex gap-1.5 border-b border-zinc-200 dark:border-zinc-800">
            {([['flags', t.flags], ['header', t.header], ['combinations', t.combinations]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === key ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'flags' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                {TCP_FLAGS.map(f => (
                  <button key={f.name} onClick={() => setSelected(f.name === selected ? null : f.name)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${selected === f.name ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-300'}`}>
                    <div className="flex items-center gap-3">
                      <span className="w-12 font-mono text-sm font-bold" style={{ color: f.color }}>{f.name}</span>
                      <span className="font-mono text-xs text-zinc-400">{f.hex}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 flex-1">{f.shortDesc}</span>
                      <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">bit {f.bit}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div>
                {selectedFlag ? (
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold font-mono" style={{ color: selectedFlag.color }}>{selectedFlag.name}</span>
                      <div>
                        <p className="text-sm font-medium">{selectedFlag.shortDesc}</p>
                        <p className="text-xs font-mono text-zinc-400">{selectedFlag.hex} — bit {selectedFlag.bit}</p>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{selectedFlag.longDesc}</p>
                    {/* Mini header showing selected bit */}
                    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/30 p-4">
                      <p className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2">Control bits (bits 8-15 of offset/flags byte)</p>
                      <div className="flex gap-1">
                        {TCP_FLAGS.map(f => {
                          const isActive = f.name === selectedFlag.name
                          return (
                            <div key={f.name}
                              className={`flex-1 text-center rounded py-2 text-[10px] font-mono font-bold transition-all ${isActive ? '' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'}`}
                              style={isActive ? { backgroundColor: selectedFlag.color, color: 'white' } : undefined}>
                              {f.name}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center text-zinc-400 text-sm">{t.clickFlag}</div>
                )}
              </div>
            </div>
          )}

          {tab === 'header' && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.clickFlag}</p>
              {/* TCP Header Diagram */}
              <div className="overflow-x-auto">
                <div className="min-w-[520px] font-mono text-[11px] space-y-0.5">
                  <div className="grid grid-cols-32 gap-0 border border-zinc-300 dark:border-zinc-600 rounded-t-lg overflow-hidden" style={{ gridTemplateColumns: 'repeat(32, 1fr)' }}>
                    {/* Bit numbers */}
                    {Array.from({ length: 32 }, (_, i) => (
                      <div key={i} className="border-r border-zinc-200 dark:border-zinc-700 text-center text-[9px] text-zinc-400 py-0.5 last:border-r-0">{i}</div>
                    ))}
                  </div>
                  {/* Row 1: Source Port | Dest Port */}
                  <div className="grid border border-t-0 border-zinc-300 dark:border-zinc-600" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className="border-r border-zinc-300 dark:border-zinc-600 text-center py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold">Source Port (16 bits)</div>
                    <div className="text-center py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold">Destination Port (16 bits)</div>
                  </div>
                  <div className="border border-t-0 border-zinc-300 dark:border-zinc-600 text-center py-2 bg-zinc-50 dark:bg-zinc-800/30">Sequence Number (32 bits)</div>
                  <div className="border border-t-0 border-zinc-300 dark:border-zinc-600 text-center py-2 bg-zinc-50 dark:bg-zinc-800/30">Acknowledgment Number (32 bits)</div>
                  {/* Flags row */}
                  <div className="border border-t-0 border-zinc-300 dark:border-zinc-600 overflow-hidden" style={{ display: 'grid', gridTemplateColumns: '4fr 3fr 9fr 16fr' }}>
                    <div className="border-r border-zinc-300 dark:border-zinc-600 text-center py-2 text-[9px] bg-zinc-50 dark:bg-zinc-800/30">Data Offset (4)</div>
                    <div className="border-r border-zinc-300 dark:border-zinc-600 text-center py-2 text-[9px] bg-zinc-50 dark:bg-zinc-800/30">Rsv (3)</div>
                    <div className="border-r border-zinc-300 dark:border-zinc-600 overflow-hidden" style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)' }}>
                      {TCP_FLAGS.map(f => (
                        <button key={f.name} onClick={() => setSelected(f.name === selected ? null : f.name)}
                          className="border-r border-zinc-300 dark:border-zinc-600 last:border-r-0 text-center py-2 text-[9px] font-bold transition-colors hover:opacity-80"
                          style={{
                            backgroundColor: selected === f.name ? f.color : undefined,
                            color: selected === f.name ? 'white' : f.color,
                          }}>
                          {f.name}
                        </button>
                      ))}
                    </div>
                    <div className="text-center py-2 bg-zinc-50 dark:bg-zinc-800/30 text-[9px]">Window Size (16 bits)</div>
                  </div>
                  <div className="border border-t-0 border-zinc-300 dark:border-zinc-600" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <div className="border-r border-zinc-300 dark:border-zinc-600 text-center py-2 bg-zinc-50 dark:bg-zinc-800/30">Checksum (16)</div>
                    <div className="text-center py-2 bg-zinc-50 dark:bg-zinc-800/30">Urgent Pointer (16)</div>
                  </div>
                  <div className="border border-t-0 border-zinc-300 dark:border-zinc-600 rounded-b-lg text-center py-2 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-400">Options (0–320 bits, if Data Offset &gt; 5)</div>
                </div>
              </div>
              {selected && selectedFlag && (
                <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: `${selectedFlag.color}15`, borderColor: `${selectedFlag.color}40`, border: '1px solid' }}>
                  <span className="font-bold" style={{ color: selectedFlag.color }}>{selectedFlag.name}</span>
                  <span className="text-zinc-600 dark:text-zinc-400 ml-2">{selectedFlag.longDesc}</span>
                </div>
              )}
            </div>
          )}

          {tab === 'combinations' && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                      <th className="px-4 py-3 text-left font-medium text-zinc-500">{t.combo}</th>
                      <th className="px-4 py-3 text-left font-medium text-zinc-500">{t.scenario}</th>
                      <th className="px-4 py-3 text-left font-medium text-zinc-500">{t.notes}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMBOS.map((c, i) => (
                      <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {c.flags.map(f => {
                              const flag = TCP_FLAGS.find(tf => tf.name === f)
                              return (
                                <span key={f} className="font-mono text-xs font-bold px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: `${flag?.color ?? '#6b7280'}20`, color: flag?.color ?? '#6b7280' }}>
                                  {f}
                                </span>
                              )
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">{c.scenario}</td>
                        <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs">{c.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-blue-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
