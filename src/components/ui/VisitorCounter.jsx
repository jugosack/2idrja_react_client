import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import './VisitorCounter.css';

const VisitorCounter = () => {
  const [visitCount, setVisitCount] = useState(0);

  // Intersection Observer for triggering the CountUp animation
  const { ref, inView } = useInView({
    triggerOnce: true, // Ensures the animation runs only once
    threshold: 0.5, // Start the animation when 50% of the section is visible
  });

  useEffect(() => {
    const currentCount = localStorage.getItem('visitCount');
    if (currentCount) {
      const newCount = parseInt(currentCount, 10) + 1;
      setVisitCount(newCount);
      localStorage.setItem('visitCount', newCount);
    } else {
      setVisitCount(1);
      localStorage.setItem('visitCount', 1);
    }
  }, []);

  return (
    <section
      ref={ref}
      className="CounterSection"
    >
      <div className="DiscoverUs">
        <h2 className="DiscoverTitle">
          DISCOVER US
        </h2>
        <div className="DiscoverLine">
          <div className="circle" />
          <hr />
          <div className="circle" />
        </div>
      </div>

      <div className="flex-grid">
        <div className="grid-item">
          <div className="LargeCircle">
            {inView ? <CountUp end={2} duration={10} /> : 0}
          </div>
          Coding Projects
        </div>

        <div className="grid-item">
          <div className="LargeCircle">
            {inView ? <CountUp end={7} duration={9} /> : 0}
          </div>
          Courses
        </div>
        <div className="grid-item">
          <div className="LargeCircle">
            {inView ? <CountUp end={visitCount} duration={5} /> : 0}
          </div>
          Visitors
        </div>
        <div className="grid-item">
          <div className="LargeCircle">
            {inView ? <CountUp end={90} duration={5} /> : 0}
            +
          </div>
          Students
        </div>
      </div>

    </section>
  );
};

export default VisitorCounter;
