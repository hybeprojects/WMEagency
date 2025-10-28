
import { Hero } from "../components/Hero";
import { LoginForm } from "../components/LoginForm";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex min-h-screen">
        <Hero />
        <LoginForm />
      </main>
    </div>
  );
}
