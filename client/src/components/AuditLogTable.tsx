import { Badge } from "@/components/ui/badge";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  numberOfQueries: number;
}

interface AuditLogTableProps {
  logs: AuditLogEntry[];
  onViewDetails: (id: string) => void;
}

export default function AuditLogTable({ logs, onViewDetails }: AuditLogTableProps) {
  return (
    <div className="overflow-x-auto" data-testid="table-audit-logs">
      <table className="w-full">
        <thead className="sticky top-0 bg-card border-b">
          <tr>
            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Timestamp
            </th>
            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              User
            </th>
            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Role
            </th>
            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Number of Queries
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-b hover-elevate transition-colors"
              data-testid={`audit-log-${log.id}`}
            >
              <td className="p-4">
                <p className="text-sm font-mono">{log.timestamp}</p>
              </td>
              <td className="p-4">
                <p className="text-sm">{log.user}</p>
              </td>
              <td className="p-4">
                <Badge
                  variant={log.role === "internal" ? "default" : "secondary"}
                  className="text-xs uppercase"
                >
                  {log.role === "internal" ? "INTERNAL TEAM" : "CLIENT"}
                </Badge>
              </td>
              <td className="p-4">
                <p className="text-sm font-semibold">{log.numberOfQueries}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
