import { Textarea } from '@/components/ui/textarea'

export default function OutputInputArea({ input, setInput, output }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Input</h2>
        <Textarea
          placeholder="Enter input here..."
          className="min-h-[100px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Output</h2>
        <div className="min-h-[200px] p-4 rounded-md bg-muted whitespace-pre-wrap">
          {output}
        </div>
      </div>
    </div>
  )
}