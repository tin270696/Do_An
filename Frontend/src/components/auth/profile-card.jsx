import { useAuth } from "@/contexts/auth";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfileCard({ onLoggedOut }) {
  const { user, logout } = useAuth();
  if(!user) return null;
  async function handleLogout() {
    await logout();
    onLoggedOut?.();
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>Name: {user.full_name}</div>
        <div>Email: {user.email}</div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
}