import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
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
import Details from './ui/HTMLdetails';

function Home() {
  const carouselRef = useRef(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const scrollNext = () => {
    carouselRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
  };

  const scrollPrev = () => {
    carouselRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
  };

  const openDetails = (course) => setSelectedCourse(course);
  const closeDetails = () => setSelectedCourse(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('token');
      let isAdminFlag = false;

      if (token) {
        try {
          const res = await axios.get('http://localhost:3000/current_user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('User role:', res.data.role);
          isAdminFlag = res.data.role === 'admin';
          setIsAdmin(isAdminFlag);
        } catch (error) {
          console.error('Error fetching current_user:', error);
          setIsAdmin(false);
        }
      }

      try {
        const courseRes = await axios.get('http://localhost:3000/courses');
        setCourses(courseRes.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    fetchData();
  }, []);

  console.log('Final isAdmin in Home:', isAdmin);

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
        <button className="carousel-control-prev" type="button" onClick={scrollPrev}>
          <ArrowSVGL className="svgCarouselArrowCourse" />
        </button>

        <div className="carousel-wrapper" ref={carouselRef}>
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              image={course.image_url || '/default-course.jpg'}
              title={course.course_name}
              description={course.description}
              duration={`${course.start_date} - ${course.end_date}`}
              price={`€${course.fee}`}
              discount=""
              places={`${course.places_left} places left`}
              onDetailsClick={() => openDetails(course)}
              isAdmin={isAdmin}
              courseId={course.id}
            />
          ))}
        </div>

        <button className="carousel-control-next" type="button" onClick={scrollNext}>
          <ArrowSVGL className="svgCarouselArrowCourse" />
        </button>
      </div>

      <VisitorCounter />
      <WebsiteCarousel />
      <OurMisiion />
      <WhatWeDo />
      <TestimoniesCarousel />
      <Footer />

      {selectedCourse && <Details course={selectedCourse} onClose={closeDetails} />}
    </>
  );
}

export default Home;
