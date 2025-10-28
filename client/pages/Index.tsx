
import { Hero } from "../components/Hero";
import { LoginForm } from "../components/LoginForm";
import { Header } from "../components/Header";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex min-h-screen pt-16">
        <Hero />
        <LoginForm />
      </main>
    </div>
  );
}
