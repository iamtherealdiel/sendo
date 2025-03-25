import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    content: "Sendo helped me recover my business account within 24 hours. Their service is exceptional!",
    author: "Sarah Johnson",
    role: "Digital Marketing Manager",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80"
  },
  {
    content: "The team's expertise in handling complex ad account issues saved our campaign during peak season.",
    author: "Michael Chen",
    role: "E-commerce Owner",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80"
  },
  {
    content: "Professional, responsive, and incredibly effective. Highly recommend their services!",
    author: "Emma Davis",
    role: "Content Creator",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl">
          What Our Clients Say
        </h2>
        
        <div className="mt-20 relative">
          <div className="relative h-96 overflow-hidden">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`absolute w-full transform transition-all duration-500 ease-in-out ${
                  idx === currentIndex
                    ? 'translate-x-0 opacity-100'
                    : idx < currentIndex
                    ? '-translate-x-full opacity-0'
                    : 'translate-x-full opacity-0'
                }`}
              >
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={testimonial.image}
                      alt={testimonial.author}
                    />
                    <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="mt-6 text-xl text-gray-600 italic">"{testimonial.content}"</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}