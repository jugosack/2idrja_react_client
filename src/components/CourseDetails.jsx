/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../services/CourseService";
import { getInstructors } from "../services/InstructorService";
import Navbar from "./ui/Navbar";
import Footer from "./ui/Footer";
import coursesReact from "./images/Courses_React.png";
import "./CourseDetails.css";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [isExpanded, setIsExpanded] = useState({ course: false });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        setInstructors([]);
        const data = await getCourseById(id);
        if (!isMounted) return;
        setCourse(data);

        try {
          const allInstructors = await getInstructors();
          if (!isMounted) return;
          const courseName = (data?.course_name || "").toLowerCase();
          const filtered = allInstructors.filter(
            (inst) => (inst?.course_name || "").toLowerCase() === courseName
          );
          setInstructors(filtered);
        } catch (e) {
          setInstructors([]);
        }
      } catch (e) {
        if (isMounted) setError("Failed to load course");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (id) fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <div className="container py-5 text-center text-white">Loading...</div>
    );
  if (error)
    return (
      <div className="container py-5 text-center text-danger">{error}</div>
    );
  if (!course)
    return (
      <div className="container py-5 text-center text-white">
        Course not found
      </div>
    );

  const headerTitle = course.course_name || "Course";
  const headerSubtitle = course.general_description || course.description || "";
  const audienceText =
    course.target_audience || course.who_can_take || course.who_is_it_for || "";
  const prerequisitesText = course.prerequisites || "";
  const outcomes = course.outcomes || course.learning_outcomes || "";
  const duration = course.duration || course.length || "";
  const price = course.price || course.cost || course.fee || "";
  const level = course.level || course.difficulty || "";

  return (
    <div className="container-fluid p-0 m-0 course-details-page">
      <Navbar className="active text-white" />

      {/* Hero combined card: image + text inside one frame */}
      <div className="container">
        <div className="course-hero-card hero-card-grid">
          <div className="hero-card-media">
            <div className="course-hero-image-wrapper">
              <img
                className="course-hero-image"
                src={course.image_url || coursesReact}
                alt={headerTitle}
              />
            </div>
            {/* Course Price below image */}
            {price && (
              <div className="course-price-below-image">
                <div className="price-badge">
                  <span className="price-icon">💰</span>
                  <span className="price-text">Course Fee: {price}</span>
                </div>
              </div>
            )}
          </div>
          <div className="hero-card-content">
            <div className="course-header">
              <h1 className="course-title">{headerTitle}</h1>
              {headerSubtitle && (
                <p className="course-subtitle">{headerSubtitle}</p>
              )}

              <div className="course-meta-bar row gx-2 gy-2 mt-2">
                {duration && (
                  <div className="col-auto">
                    <span className="chip">Duration: {duration}</span>
                  </div>
                )}
                {level && (
                  <div className="col-auto">
                    <span className="chip">Level: {level}</span>
                  </div>
                )}
              </div>

              <div className="text-container">
                <div
                  className={`paragraph-content ${
                    isExpanded.course ? "" : "text-truncated-mobile"
                  }`}
                >
                  <p className="pt-3 paragraph-lead">
                    {course.description || headerSubtitle || headerTitle}
                  </p>
                </div>
                {!isExpanded.course ? (
                  <span
                    id="see-more-course-details"
                    className="toggle-text-inline"
                    role="button"
                    tabIndex="0"
                    onClick={() =>
                      setIsExpanded((s) => ({ ...s, course: true }))
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setIsExpanded((s) => ({ ...s, course: true }))
                    }
                  >
                    ... View More
                  </span>
                ) : (
                  <div className="toggle-text-container">
                    <span
                      className="toggle-text"
                      role="button"
                      tabIndex="0"
                      onClick={() =>
                        setIsExpanded((s) => ({ ...s, course: false }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        setIsExpanded((s) => ({ ...s, course: false }))
                      }
                    >
                      View Less
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who it's for */}
      {audienceText && (
        <div className="container">
          <div className="course-section">
            <h2 className="section-title">Who is this for?</h2>
            <p className="m-0 paragraph-justified">{audienceText}</p>
          </div>
        </div>
      )}

      {/* Prerequisites */}
      {prerequisitesText && (
        <div className="container">
          <div className="course-section">
            <h2 className="section-title">Prerequisites</h2>
            <p className="m-0 paragraph-justified">{prerequisitesText}</p>
          </div>
        </div>
      )}

      {/* Outcomes */}
      {outcomes && (
        <div className="container">
          <div className="course-section">
            <h2 className="section-title">What you'll learn</h2>
            {Array.isArray(outcomes) ? (
              <ul className="list-unstyled m-0">
                {outcomes.map((item, i) => (
                  <li key={i} className="mb-2">
                    • {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 paragraph-justified">{outcomes}</p>
            )}
          </div>
        </div>
      )}

      {/* Instructors */}
      <div className="container">
        <div className="course-section">
          <h2 className="section-title">Our instructors</h2>
          <div className="">
            {instructors.map((inst, idx) => {
              const key = inst.id || idx;
              const toggleKey = `inst_${key}`;
              const expanded = !!isExpanded[toggleKey];
              return (
                <div
                  key={key}
                  className={`d-flex flex-column ${
                    idx % 2 === 0 ? "flex-lg-row" : "flex-lg-row-reverse"
                  } mt-4 mb-3 instructor-section`}
                >
                  <div className="d-flex flex-column col-lg-4 col-12 instructor-image-container">
                    <img
                      className="img-fluid instructor-image"
                      src={inst.profile_pic_url || "/default-avatar.jpg"}
                      alt={`${inst.first_name || ""} ${inst.last_name || ""}`}
                    />
                  </div>
                  <div className="d-flex flex-column col-lg-7 col-12 mt-2 align-self-start instructor-text-content">
                    <h3 className="mt-3 mx-0">
                      {`${inst.first_name || ""} ${
                        inst.last_name || ""
                      }`.trim() || "Instructor"}
                    </h3>
                    {(inst.expertise || inst.course_name) && (
                      <div className="instructor-meta">
                        {inst.expertise ? (
                          <span className="instructor-chip">
                            🚀 💻 {inst.expertise}
                          </span>
                        ) : inst.course_name ? (
                          <span className="instructor-chip">
                            💻 {inst.course_name}
                          </span>
                        ) : null}
                      </div>
                    )}
                    <div className="text-container">
                      <div
                        className={`paragraph-content ${
                          expanded ? "" : "text-truncated-mobile"
                        }`}
                      >
                        <p className="pt-3 paragraph-justified">
                          {inst.description || ""}
                        </p>
                      </div>
                      {!expanded ? (
                        <span
                          className="toggle-text-inline"
                          role="button"
                          tabIndex="0"
                          onClick={() =>
                            setIsExpanded((s) => ({ ...s, [toggleKey]: true }))
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            setIsExpanded((s) => ({ ...s, [toggleKey]: true }))
                          }
                        >
                          ... View More
                        </span>
                      ) : (
                        <div className="toggle-text-container">
                          <span
                            className="toggle-text"
                            role="button"
                            tabIndex="0"
                            onClick={() =>
                              setIsExpanded((s) => ({
                                ...s,
                                [toggleKey]: false,
                              }))
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              setIsExpanded((s) => ({
                                ...s,
                                [toggleKey]: false,
                              }))
                            }
                          >
                            View Less
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Footer />
      </div>
    </div>
  );
}
