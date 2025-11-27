import Link from "next/link";
import { Clock, Filter, PlusCircle } from "lucide-react";
import { sampleRun } from "../../lib/mockData";

const statuses = [
  { label: "Pending", value: "pending" },
  { label: "Running", value: "running" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary font-semibold">Dashboard</p>
          <h1 className="text-3xl font-bold text-gray-900">Arena runs at a glance</h1>
          <p className="text-gray-700">Filter by status, review run history, and jump into live debates.</p>
        </div>
        <Link href="/arenas/build" className="btn-primary">
          <PlusCircle className="mr-2 h-4 w-4" /> New arena run
        </Link>
      </div>
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Filter className="h-4 w-4" /> Filter by status:
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button key={status.value} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:border-primary">
              {status.label}
            </button>
          ))}
        </div>
      </div>
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">#{sampleRun.id}</p>
            <h3 className="text-xl font-semibold text-gray-900">{sampleRun.input_prompt}</h3>
            <p className="text-sm text-gray-600">Status: {sampleRun.status}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Clock className="h-4 w-4" /> {new Date(sampleRun.created_at || "").toLocaleString()}
          </div>
          <Link href={`/runs/${sampleRun.id}`} className="btn-secondary">
            View run
          </Link>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Track structured rounds, view critiques, and export JSON for automation. Real-time updates are wired through Supabase
          subscriptions once deployed.
        </p>
      </div>
    </div>
  );
}
