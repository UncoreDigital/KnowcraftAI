import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  queryPreview: string;
  responsePreview: string;
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
              Query Preview
            </th>
            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Response Preview
            </th>
            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
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
                  {log.role === "internal" ? "ADMIN" : log.role === "client" ? "INTERNAL" : log.role}
                </Badge>
              </td>
              <td className="p-4">
                <p className="text-sm line-clamp-2 max-w-xs">{log.queryPreview}</p>
              </td>
              <td className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                  {log.responsePreview}
                </p>
              </td>
              <td className="p-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onViewDetails(log.id)}
                  data-testid={`button-view-${log.id}`}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
