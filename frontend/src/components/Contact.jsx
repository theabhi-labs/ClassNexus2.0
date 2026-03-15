import React from "react";
import { Element } from "react-scroll";
import { Phone, MessageCircle, Send, Youtube, Instagram, MapPin, ArrowUpRight, ExternalLink } from "lucide-react";

const Contact = () => {
  const contactMethods = [
    {
      name: "Call Us",
      value: "+91 98765 43210",
      icon: <Phone className="w-5 h-5 md:w-6 h-6" />,
      link: "tel:+919876543210",
      color: "from-blue-500 to-blue-600 shadow-blue-200",
    },
    {
      name: "WhatsApp",
      value: "Chat Now",
      icon: <MessageCircle className="w-5 h-5 md:w-6 h-6" />,
      link: "https://wa.me/919876543210",
      color: "from-green-500 to-emerald-600 shadow-emerald-200",
    },
    {
      name: "Telegram",
      value: "Community",
      icon: <Send className="w-5 h-5 md:w-6 h-6" />,
      link: "https://t.me/yourusername",
      color: "from-sky-400 to-blue-500 shadow-sky-200",
    },
    {
      name: "YouTube",
      value: "Tutorials",
      icon: <Youtube className="w-5 h-5 md:w-6 h-6" />,
      link: "https://youtube.com/@yourchannel",
      color: "from-red-500 to-rose-700 shadow-rose-200",
    },
    {
      name: "Instagram",
      value: "Updates",
      icon: <Instagram className="w-5 h-5 md:w-6 h-6" />,
      link: "https://instagram.com/yourprofile",
      color: "from-pink-500 via-purple-500 to-orange-500 shadow-pink-200",
    },
  ];

  return (
    <Element name="contact">
      <section className="py-20 md:py-28 bg-[#fbfcfd] relative overflow-hidden">
        {/* Subtle Background Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">Touch</span>
            </h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto text-base md:text-lg">
              Connectivity made simple. Reach out directly on your favorite platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
            
            {/* LEFT - Contact Cards (2 Columns on Mobile, 1 on Large Screens) */}
            <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col lg:flex-row items-center lg:items-center p-4 md:p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 active:scale-95"
                >
                  <div className={`bg-gradient-to-br ${method.color} p-3 rounded-2xl text-white shadow-lg transition-transform group-hover:rotate-6 group-hover:scale-110`}>
                    {method.icon}
                  </div>
                  <div className="mt-3 lg:mt-0 lg:ml-5 text-center lg:text-left">
                    <h4 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{method.name}</h4>
                    <p className="text-sm md:text-lg font-bold text-slate-800 flex items-center gap-1">
                      {method.value}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* RIGHT - Professional Map Container */}
            <div className="lg:col-span-7">
              <div className="relative h-full bg-white p-2 md:p-3 rounded-[2.5rem] shadow-2xl border border-slate-100 group">
                
                {/* Browser UI Header Decoration */}
                <div className="flex items-center justify-between mb-3 px-4 pt-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    JAS Computer: Active Now
                  </div>
                </div>

                {/* Actual Map Frame */}
                <div className="relative h-[400px] md:h-full min-h-[400px] rounded-[1.8rem] overflow-hidden">
                  <iframe
                    title="JAS Computer Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.123456789!2d82.4075998!3d25.4651238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398fe3d0edfb8de9%3A0xdef7acc6bf581418!2sJAS+COMPUTER+INSTITUTE+%26+TRAINING+CENTER!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                    className="absolute inset-0 w-full h-full grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-1000"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>

                  {/* Floating Action Button for Map */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-6 z-20">
                    <a
                      href="https://maps.app.goo.gl/JmyCuFiavMNuS59z8"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl border border-white/40 text-slate-900 text-sm font-black hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                    >
                      <MapPin className="w-4 h-4" />
                      Get Directions
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  </div>

                  {/* Desktop-only Address Overlay */}
                  <div className="absolute top-6 left-6 hidden md:block z-10">
                    <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl text-white max-w-[240px] border border-white/10 shadow-2xl">
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter mb-1">Our Location</p>
                      <p className="text-sm font-medium leading-relaxed">
                        123 Learning Street, Tech Hub, Lucknow, UP 226001
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Element>
  );
};

export default Contact;
