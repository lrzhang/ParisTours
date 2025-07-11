import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedTour } from '../hooks/useTour';
import { formatPrice } from '../utils/priceUtils';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './Landing.css';

const Landing: React.FC = () => {
  const { data: tour, loading, error, execute } = useFeaturedTour();

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) {
    return <LoadingSpinner message="Loading featured tour..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!tour) {
    return <ErrorMessage message="No tours available" />;
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__background">
          <img 
            src={`/img/tours/${tour.imageCover}`} 
            alt={tour.name}
            className="hero__image"
          />
          <div className="hero__overlay"></div>
        </div>
        
        <div className="hero__content">
          <div className="container">
            <h1 className="hero__title">{tour.name}</h1>
            <p className="hero__subtitle">{tour.summary}</p>
            <div className="hero__features">
              <div className="hero__feature">
                <span className="hero__feature-icon">⏱️</span>
                <span>{tour.duration} hours</span>
              </div>
              <div className="hero__feature">
                <span className="hero__feature-icon">👥</span>
                <span>Up to {tour.maxGroupSize} people</span>
              </div>
              <div className="hero__feature">
                <span className="hero__feature-icon">⭐</span>
                <span>{tour.ratingsAverage} rating</span>
              </div>
            </div>
            <div className="hero__cta">
              <Link to={`/book/${tour._id}`} className="btn btn--primary btn--large">
                Book Your Tour Now
              </Link>
              <p className="hero__price">Starting at {formatPrice(tour.price)} per person</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Overview Section */}
      <section className="tour-overview">
        <div className="container">
          <div className="tour-overview__content">
            <div className="tour-overview__text">
              <h2 className="section-title">About This Tour</h2>
              <p className="tour-overview__description">{tour.description}</p>
              
              <div className="tour-overview__highlights">
                <h3>What's Included</h3>
                <ul className="tour-overview__list">
                  <li>Expert local guide</li>
                  <li>Small group experience</li>
                  <li>Photo opportunities (our guide will help you take photos)</li>
                  <li>Local insights and stories</li>
                </ul>
              </div>

              <div className="tour-overview__highlights">
                <h3>Tour Details</h3>
                <div className="tour-overview__details">
                  <div className="tour-overview__detail">
                    <strong>Difficulty:</strong> {tour.difficulty}
                  </div>
                  <div className="tour-overview__detail">
                    <strong>Duration:</strong> {tour.duration} hours
                  </div>
                  <div className="tour-overview__detail">
                    <strong>Group Size:</strong> Up to {tour.maxGroupSize} people
                  </div>
                  <div className="tour-overview__detail">
                    <strong>Starting Point:</strong> {tour.startLocation.description}
                  </div>
                </div>
              </div>
            </div>

            <div className="tour-overview__card">
              <div className="tour-card">
                <div className="tour-card__image">
                  <img src={`/img/tours/${tour.imageCover}`} alt={tour.name} />
                </div>
                <div className="tour-card__content">
                  <h3 className="tour-card__title">{tour.name}</h3>
                  <div className="tour-card__rating">
                    <span className="tour-card__stars">★★★★★</span>
                    <span className="tour-card__rating-text">
                      {tour.ratingsAverage} ({tour.ratingsQuantity} reviews)
                    </span>
                  </div>
                  <div className="tour-card__price">
                    <span className="tour-card__price-amount">{formatPrice(tour.price)}</span>
                    <span className="tour-card__price-text">per person</span>
                  </div>
                  <Link to={`/book/${tour._id}`} className="btn btn--primary btn--large">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title text-center">Why Choose ParisTours?</h2>
          <div className="features__grid">
            <div className="feature-card">
              <div className="feature-card__icon">🎯</div>
              <h3 className="feature-card__title">Expert Guide</h3>
              <p className="feature-card__description">
                Our passionate local guide bring Paris to life with insider knowledge and fascinating stories.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-card__icon">👥</div>
              <h3 className="feature-card__title">Small Groups</h3>
              <p className="feature-card__description">
                Intimate group sizes ensure a personalized experience and plenty of time for questions.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-card__icon">📸</div>
              <h3 className="feature-card__title">Photo Opportunities</h3>
              <p className="feature-card__description">
                We know the best spots for stunning photos and will help you capture perfect memories.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-card__icon">💎</div>
              <h3 className="feature-card__title">Hidden Gems</h3>
              <p className="feature-card__description">
                Discover secret spots and local favorites that most tourists never see.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience Paris Like Never Before?</h2>
            <p className="cta-description">
              Join us for an unforgettable journey through the heart of Paris. 
              Book your tour today and create memories that will last a lifetime.
            </p>
            <Link to={`/book/${tour._id}`} className="btn btn--primary btn--large">
              Start Your Adventure
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing; 