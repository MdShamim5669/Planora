'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Event } from '@/types';
import { EventCard } from './EventCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface UpcomingSliderProps {
  events: Event[];
}

export const UpcomingSlider: React.FC<UpcomingSliderProps> = ({ events }) => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Slider Controls Bar */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <button
          ref={prevRef}
          aria-label="Previous events"
          className="w-9 h-9 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          ref={nextRef}
          aria-label="Next events"
          className="w-9 h-9 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation !== 'boolean' && swiper.params.navigation) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="pb-12"
      >
        {events.map((event) => (
          <SwiperSlide key={event.id} className="h-auto">
            <div className="h-full pb-1">
              <EventCard event={event} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UpcomingSlider;
