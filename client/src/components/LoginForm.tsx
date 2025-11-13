import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lock } from "lucide-react";
import { useState } from "react";

interface LoginFormProps {
  onLogin: (username: string, password: string, userType: "internal" | "client") => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"internal" | "client">("client");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password, userType);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
<div className="inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4">
  <img 
    src="/logo-Knowcraft-Analytics.png" 
    alt="Knowcraft Analytics Logo" 
    // Adjusted to standard w-12 h-12 to fit the container size
    className="w-15 h-15 object-cover" 
  />
</div>
          <h1 className="text-2xl font-semibold mb-2">KnowCraft AI Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Secure intelligent query system for fintech
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              data-testid="input-username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="input-password"
            />
          </div>

          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup value={userType} onValueChange={(v) => setUserType(v as "internal" | "client")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" data-testid="radio-client" />
                <Label htmlFor="client" className="font-normal cursor-pointer">
                  Client Account
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="internal" id="internal" data-testid="radio-internal" />
                <Label htmlFor="internal" className="font-normal cursor-pointer">
                  Internal Team
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full h-12" data-testid="button-login">
            Sign In
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Secured with enterprise-grade encryption and audit logging
        </p>
      </Card>
    </div>
  );
}
