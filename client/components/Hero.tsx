
import { Star, Shield, Globe } from "lucide-react";

export function Hero() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <img
        src="https://images.unsplash.com/photo-1511795409834-ef04bbd51725?q=80&w=2070&auto=format&fit=crop"
        alt="Luxury event"
        className="w-full h-full object-cover"
      />
      <div className="relative p-12 flex flex-col justify-end text-white">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold font-display mb-6 leading-tight">
            Streamline Your Event Experience
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Access all your event details, documents, and communications in one
            secure, centralized hub.
          </p>
          <ul className="space-y-6">
            <li className="flex items-start">
              <div className="p-2 bg-white/10 rounded-full mr-4">
                <Star className="w-6 h-6 text-wme-gold" />
              </div>
              <div>
                <h3 className="font-semibold">Personalized Dashboard</h3>
                <p className="text-sm opacity-80">
                  View your event timeline, manage bookings, and stay
                  up-to-date.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="p-2 bg-white/10 rounded-full mr-4">
                <Shield className="w-6 h-6 text-wme-gold" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Document Handling</h3>
                <p className="text-sm opacity-80">
                  Upload and access contracts, invoices, and other important
                  files.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="p-2 bg-white/10 rounded-full mr-4">
                <Globe className="w-6 h-6 text-wme-gold" />
              </div>
              <div>
                <h3 className="font-semibold">Direct Communication</h3>
                <p className="text-sm opacity-80">
                  Communicate with your event coordinator and receive important
                  updates.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
