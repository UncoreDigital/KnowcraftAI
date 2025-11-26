import AuditLogTable from "@/components/AuditLogTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { useState } from "react";

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockLogs = [
    {
      id: "1",
      timestamp: "2024-11-03 14:32:15",
      user: "john.doe@nocraft.com",
      role: "internal",
      queryPreview: "What are the compliance requirements for Q4 2024?",
      responsePreview: "The Q4 2024 compliance requirements include updated KYC procedures, enhanced AML monitoring...",
    },
    {
      id: "2",
      timestamp: "2024-11-03 14:28:42",
      user: "client_acme_corp",
      role: "client",
      queryPreview: "How do I access my investment portfolio dashboard?",
      responsePreview: "You can access your investment portfolio dashboard by logging into your account...",
    },
    {
      id: "3",
      timestamp: "2024-11-03 14:15:33",
      user: "sarah.johnson@nocraft.com",
      role: "internal",
      queryPreview: "Generate a market analysis report for technology sector",
      responsePreview: "Technology Sector Analysis: The sector has shown strong growth with a 15% increase...",
    },
    {
      id: "4",
      timestamp: "2024-11-03 13:45:20",
      user: "client_techstart_inc",
      role: "client",
      queryPreview: "What are the fees for wire transfers?",
      responsePreview: "Wire transfer fees vary by destination: Domestic transfers are $25, international...",
    },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6" data-testid="page-audit">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Audit Logs</h1>
          <p className="text-muted-foreground">Complete audit trail of all queries and responses</p>
        </div>
        <Button data-testid="button-export-logs">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search audit logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-audit"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <AuditLogTable
          logs={mockLogs}
          onViewDetails={(id) => console.log("View details:", id)}
        />
      </div>
      </div>
    </div>
  );
}
