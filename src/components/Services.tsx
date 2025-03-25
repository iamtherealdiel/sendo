import React from 'react';
import { Shield, MessageSquare, Settings, ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Account Recovery',
    description: 'Get expert help recovering banned or suspended social media accounts quickly and efficiently.',
    icon: Shield,
  },
  {
    title: 'Ad Management Support',
    description: 'Professional assistance with advertising account issues and campaign optimization.',
    icon: MessageSquare,
  },
  {
    title: 'Custom Solutions',
    description: 'Tailored support for your specific business needs and platform requirements.',
    icon: Settings,
  },
];

export default function Services() {
  return (
    <div id="services" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl leading-relaxed tracking-wide px-4 sm:px-6 mb-8">
            If general support on social media has left you frustrated, you have come to the right place.
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Comprehensive solutions for all your social media challenges
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="relative group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-white p-6 rounded-xl">
                <service.icon className="h-12 w-12 text-blue-600" />
                <h3 className="mt-8 text-lg font-semibold text-gray-900">
                  {service.title}
                </h3>
                <p className="mt-4 text-gray-500">
                  {service.description}
                </p>
                <button className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-700">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}