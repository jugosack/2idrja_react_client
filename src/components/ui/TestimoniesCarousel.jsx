import './TestimoniesCarousel.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ReactComponent as ArrowSVGL } from '../icons/small-arrow-prev-small-svgrepo-com.svg';
import { ReactComponent as ArrowSVGR } from '../icons/small-arrow-next-small-svgrepo-com.svg';

const TestimoniesCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});

  const MAX_CHARS = 100; // Character limit before showing "Read more"

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3000/reviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const toggleExpand = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Star Rating Component
  const StarRating = ({ rating }) => (
    <div className="testimonial-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`testimonial-star ${rating >= star ? 'is-filled' : ''}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="rating-text">
        (
        {rating}
        /5)
      </span>
    </div>
  );

  StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
  };

  // Review Text Component with Read More/Less
  const ReviewText = ({ text, reviewId }) => {
    const isExpanded = expandedReviews[reviewId];
    const isLongText = text && text.length > MAX_CHARS;

    if (!text) return null;

    const displayText = isLongText && !isExpanded
      ? `${text.substring(0, MAX_CHARS)}...`
      : text;

    return (
      <div className="testimonial-text-wrapper">
        <p className="testimonial-text">
          &ldquo;
          {displayText}
          &rdquo;
        </p>
        {isLongText && (
          <button
            type="button"
            className="read-more-btn"
            onClick={() => toggleExpand(reviewId)}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    );
  };

  ReviewText.propTypes = {
    text: PropTypes.string,
    reviewId: PropTypes.number.isRequired,
  };

  ReviewText.defaultProps = {
    text: '',
  };

  // Flag Badges Component
  const FlagBadges = ({ flags }) => {
    if (!flags) return null;

    const activeFlags = Object.entries(flags)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (activeFlags.length === 0) return null;

    const flagLabels = {
      engaging: '🎯 Engaging',
      structured: '📚 Well Structured',
      knowledgeable: '🧠 Knowledgeable',
    };

    return (
      <div className="testimonial-flags">
        {activeFlags.map((flag) => (
          <span key={flag} className="flag-badge">
            {flagLabels[flag] || flag}
          </span>
        ))}
      </div>
    );
  };

  FlagBadges.propTypes = {
    flags: PropTypes.shape({
      engaging: PropTypes.bool,
      structured: PropTypes.bool,
      knowledgeable: PropTypes.bool,
    }),
  };

  FlagBadges.defaultProps = {
    flags: null,
  };

  // Custom Next Arrow
  const CustomNextArrow = ({ className, onClick }) => (
    <div
      className={`${className} custom-next-arrow`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <ArrowSVGR className="svgCarouselArrow" />
    </div>
  );

  CustomNextArrow.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  };

  CustomNextArrow.defaultProps = {
    className: '',
  };

  const SamplePrevArrow = ({ className, style, onClick }) => (
    <div
      className={`${className} custom-prev-arrow`}
      style={{
        ...style,
        borderRadius: '50%',
        width: '14px',
        height: '14px',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        border: 'none',
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <ArrowSVGL className="svgCarouselArrow" />
    </div>
  );

  SamplePrevArrow.propTypes = {
    className: PropTypes.string,
    style: PropTypes.shape({}),
    onClick: PropTypes.func.isRequired,
  };

  SamplePrevArrow.defaultProps = {
    className: '',
    style: { backgroundColor: 'black' },
  };

  const settings = {
    dots: true,
    className: 'center',
    infinite: reviews.length > 3,
    centerPadding: '60px',
    speed: 400,
    slidesToShow: Math.min(3, reviews.length),
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1395,
        settings: {
          slidesToShow: Math.min(3, reviews.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: Math.min(2, reviews.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
    ],
  };

  if (loading) {
    return (
      <section className="SectionT p-3">
        <div className="testimonial-loading">
          <div className="loading-spinner" />
          <p>Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="SectionT p-3">
        <div className="text-center text-danger">
          Error:
          {' '}
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="SectionT p-3">
      <div className="row d-flex justify-content-center">
        <div className="col-md-10 col-xl-8 text-center">
          <h3 className="testimonial-title">Testimonials</h3>
          <p className="testimonial-subtitle">
            Discover how our expertly designed courses support learners at every stage, helping them build
            practical skills
            and confidence through clear, engaging content. Our learning experiences empower students to grow
            personally and
            achieve their professional goals.
          </p>
        </div>
      </div>
      <div className="slider-container">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Slider {...settings}>
          {reviews.map((review) => (
            <div key={review.id} className="testimonial-card-wrapper">
              <div className="testimonial-card">
                <div className="testimonial-quote-icon">&ldquo;</div>
                <div className="testimonial-content">
                  <div className="testimonial-avatar-wrapper">
                    <img
                      src={review.user?.avatar_url || 'https://via.placeholder.com/150'}
                      alt={`${review.user?.first_name || 'User'}'s avatar`}
                      className="testimonial-avatar"
                    />
                    <div className="avatar-ring" />
                  </div>

                  <div className="testimonial-info">
                    <h5 className="testimonial-name">
                      {review.user?.first_name}
                      {' '}
                      {review.user?.last_name}
                    </h5>
                    <span className="testimonial-course">
                      {review.course?.course_name}
                    </span>
                  </div>

                  <StarRating rating={review.rating || 0} />

                  <ReviewText text={review.body} reviewId={review.id} />

                  <FlagBadges flags={review.flags} />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimoniesCarousel;
