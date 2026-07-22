export default function AuditStats({ logs = [] }) {

  const totalLogs = logs.length;

  const today = new Date().toDateString();

  const todayLogs = logs.filter(
    log => new Date(log.createdAt).toDateString() === today
  ).length;

  const activeUsers = new Set(
    logs.map(log => log.user)
  ).size;

  const modules = new Set(
    logs.map(log => log.module)
  ).size;

  const cards = [
    {
      title: "Total Logs",
      value: totalLogs,
      icon: (
        <svg
          className="w-7 h-7 text-blue-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M9 17v-6m3 6V7m3 10v-4" />
          <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
      ),
    },

    {
      title: "Today's Logs",
      value: todayLogs,
      icon: (
        <svg
          className="w-7 h-7 text-green-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M8 7V3m8 4V3M4 11h16" />
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
          />
        </svg>
      ),
    },

    {
      title: "Editors",
      value: activeUsers,
      icon: (
        <svg
          className="w-7 h-7 text-amber-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },

    {
      title: "Modules",
      value: modules,
      icon: (
        <svg
          className="w-7 h-7 text-purple-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      {cards.map(card => (

        <div
          key={card.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                {card.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {card.value}
              </h2>

            </div>

            <div className="rounded-xl bg-slate-100 p-3">
              {card.icon}
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}