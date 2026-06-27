import { Link } from "react-router-dom";

const RecentUpdatesSection = ({ recentUpdates = [] }) => (
  <div className="mb-1 overflow-hidden rounded-3xl border border-[#7f1d1d] bg-white text-left shadow-sm">
    <div className="bg-[#7f1d1d] px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white">
      🔥 RECENT UPDATES
    </div>

    <div className="relative px-3 py-2 pb-4">
      <div className="divide-y divide-dashed divide-slate-200">
        {recentUpdates.map((item) => (
          <div
            key={item.id}
            className="flex min-h-[42px] items-center justify-between gap-2 py-1.5 text-[14px] leading-tight text-slate-700"
          >
            <span className="min-w-0 flex-1 text-blue-700 transition hover:text-[#cc0000] hover:underline">
              <Link to={`/job/${item.slug || item.id}`} state={{ title: item.title }}>
                {item.title}
              </Link>
            </span>

            {item.isLatest && (
              <span className="shrink-0 rounded bg-[#cc0000] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                NEW
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  </div>
);

export default RecentUpdatesSection;
