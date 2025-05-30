/* eslint-disable react/no-unescaped-entities */
import React, { useRef } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './ui/Navbar';
import Hero from './ui/Hero';
import OurMisiion from './ui/OurMission';
import Footer from './ui/Footer';
import CourseCard from './ui/CourseCard';
import VisitorCounter from './ui/VisitorCounter';
import TestimoniesCarousel from './ui/TestimoniesCarousel';
import WhatWeDo from './ui/WhatWeDo';
import OurCoreBeliefs from './ui/OurCoreBeliefs';
import WebsiteCarousel from './ui/WebsitesCarousel';
import { ReactComponent as ArrowSVGL } from './icons/small-arrow-prev-small-svgrepo-com.svg';

function Home() {
  const carouselRef = useRef(null);

  const scrollNext = () => {
    carouselRef.current.scrollBy({ left: 280, behavior: 'smooth' }); // Adjust scroll distance if needed
  };

  const scrollPrev = () => {
    carouselRef.current.scrollBy({ left: -280, behavior: 'smooth' }); // Adjust scroll distance if needed
  };

  return (
    <>
      <div className="background w-100">
        <Navbar />
        <Hero />
      </div>
      <div className="d-flex flex-column">

        <OurCoreBeliefs />

      </div>
      <div className="carousel-container">
        {/* Previous button comes first */}
        <button
          className="carousel-control-prev"
          type="button"
          onClick={scrollPrev}
          aria-label="Previous slide"
        >
          <ArrowSVGL className="svgCarouselArrowCourse" />

        </button>

        <div className="carousel-wrapper" ref={carouselRef}>
          <CourseCard
            image="/images/html-wallpaper.jpg"
            title="HTML Course"
            duration="01 January - 01 February"
            discount="120$"
            price="75$"
            places="2 places left"
          />
          <CourseCard
            image="./images/ReactNode.jpg"
            title="React&Javascript"
            duration="01 March - 15 April"
            discount="150$"
            price="99$"
            places="4 places left"
          />
          <CourseCard
            image="./images/java.jpg"
            title="Java"
            duration="01 November - 15 November"
            discount="150$"
            price="99$"
            places="13 places left"
          />
          <CourseCard
            image="./images/c-wallpaper.webp"
            title="C#"
            duration="01 September - 31 October"
            discount="200$"
            price="150$"
            places="7 places left"
          />
          <CourseCard
            image="./images/cssfix.png"
            title="CSS Course"
            duration="01 November - 15 November"
            discount="150$"
            price="99$"
            places="13 places left"
          />
          <CourseCard
            image="./images/rrails.png"
            title="Ruby On Rails"
            duration="01 November - 15 November"
            discount="150$"
            price="99$"
            places="13 places left"
          />
        </div>

        {/* Next button, now rotated to point right */}
        <button
          className="carousel-control-next"
          type="button"
          onClick={scrollNext}
          aria-label="Next slide"
        >
          <ArrowSVGL className="svgCarouselArrowCourse" />

        </button>
      </div>

      <VisitorCounter />
      <WebsiteCarousel />
      <OurMisiion />
      <WhatWeDo />

      <TestimoniesCarousel />
      <Footer />
    </>
  );
}

export default Home;
