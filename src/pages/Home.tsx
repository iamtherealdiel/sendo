import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatButton from '../components/ChatButton';

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Services />
      <Testimonials />
      <FAQ />
      <Footer />
      <ChatButton />
    </div>
  );
}