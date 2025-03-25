import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How long does account recovery typically take?",
    answer: "Most account recoveries are completed within 24-48 hours. However, complex cases may take longer depending on the specific situation and platform requirements."
  },
  {
    question: "What types of account issues do you handle?",
    answer: "We handle a wide range of issues including account suspensions, ad account restrictions, payment problems, content strikes, and general account access issues across all major social media platforms."
  },
  {
    question: "How do I get started with your service?",
    answer: "Simply click the 'Get Started' button above to create an account and submit your case. Our team will review your situation and contact you with next steps within 2 hours."
  },
  {
    question: "What information do I need to provide?",
    answer: "You'll need to provide basic account details, a description of the issue, and any relevant screenshots or error messages. We'll guide you through the exact requirements once you submit your case."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h2>
        
        <div className="mt-12 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                className="w-full py-6 flex justify-between items-center text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="pb-6 text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}