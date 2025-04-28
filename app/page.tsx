import { ModeToggle } from "@/components/ModeToggle";
import SignIn from "@/components/SignIn";

export default function Home() {
  return (
    <div className="flex gap-4">
      <h1>Curora</h1>
      <ModeToggle />
      <SignIn />
    </div>
  );
}
