import './WebsitesCarousel.css';
import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ReactComponent as ArrowSVGL } from '../icons/small-arrow-prev-small-svgrepo-com.svg';
import { ReactComponent as ArrowSVGR } from '../icons/small-arrow-next-small-svgrepo-com.svg';

const WebsiteCarousel = () => {
  // Custom Next Arrow
  const CustomNextArrow = ({ className, onClick }) => (
    <div
      className={`${className} custom-next-arrow`}
      id="custom-next-arrow-websites"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <ArrowSVGR className="svgCarouselArrowWebsites" />

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
      id="custom-prev-arrow-websites"
      style={{
        ...style,
        borderRadius: '50%',
        width: '14px',
        height: '14px',
        // display: 'block',
        alignItems: 'center',
        justifyContent: 'center',
        // right: '-20px',
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
      <ArrowSVGL className="svgCarouselArrowWebsites" />

    </div>
  );

  // PropTypes validation
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
    infinite: true,
    centerPadding: '60px',
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: false,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <SamplePrevArrow />,
    // responsive: [
    //   {
    //     breakpoint: 800,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //       initialSlide: 2,
    //     },
    //   },
    // ],
  };

  return (
    <section className="SectionWebsitesCarousel">
      {/* bg-primary bg-opacity-10 */}

      <h2 className="d-flex justify-content-center mt-2 mb-2">Our Projects</h2>
      <div className="DiscoverLine" id="DiscoverLineWebsites">
        <div className="circle" id="circleWebsites" />
        <hr />
        <div className="circle" id="circleWebsites" />
      </div>

      {/*             Slider Starts here                */}
      <div
        className="slider-container"
        id="slider-containerWebsites"
      >
        {/*eslint-disable*/}
        <Slider {...settings}>
          {/* eslint-enable */}
          {/*             first crad                        */}
          <div className="carddd">
            <div
              className="carouselKarticka"
              id="kartickaWebsajt"
            >
              <img
                src="/images/asprovaltam.com-1440x800px_.png"
                alt=""
                className="website-screenshot-desktop"
              />
              <div className="card-body" id="card-body-websites">
                <h5 className="card-title">Asprovalta M Apartments</h5>
              </div>
            </div>

          </div>

          {/* second card */}
          <div className="carddd">
            <div
              className="carouselKarticka"
              id="kartickaWebsajt"
            >
              <img
                src="/images/lepenecmonitoringsolutions1440x800px_.png"
                alt=""
                className="website-screenshot-desktop"
              />
              <div className="card-body" id="card-body-websites">
                <h5 className="card-title">Flood detection and waste monitoring</h5>
              </div>
            </div>

          </div>

          {/* third card */}
          <div className="carddd">
            <div
              className="carouselKarticka"
              id="kartickaWebsajt"
            >
              <img
                src="/images/fakestoreapi-898e.onrender.com-1440x800px_.png"
                alt=""
                className="website-screenshot-desktop"
              />
              <div className="card-body" id="card-body-websites">
                <h5 className="card-title">Fake clothes shop</h5>
              </div>
            </div>
          </div>

          {/* fourth card */}
          <div className="carddd">
            <div
              className="carouselKarticka"
              id="kartickaWebsajt"
            >
              <img
                src="/images/Innovation-1440x800px-localhost_3000_.png"
                alt=""
                className="website-screenshot-desktop"
              />
              <div className="card-body" id="card-body-websites">
                <h5 className="card-title">Programming courses</h5>
              </div>
            </div>
          </div>

        </Slider>
      </div>
    </section>
  );
};

export default WebsiteCarousel;
