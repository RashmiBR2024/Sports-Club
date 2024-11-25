import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Section() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    const target = document.querySelector('#animated-section');
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  const pageMap = {
    'Join the Club !': '/join-club',
    Matches: '/matches',
    Teams: '/teams',
    'All Players': '/players',
  };

  return (
    <div
      id="animated-section"
      style={{
        height: '600px',
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          color: '#333',
          fontStyle: 'ProstoOne',
          marginTop: '0',
          marginBottom: '40px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}
      >
        What Are You Looking For?
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '30px',
          justifyContent: 'center',
          width: '100%',
          marginTop: '20px',
          flexWrap: 'wrap',
        }}
      >
        {['Join the Club !', 'Matches', 'Teams', 'All Players'].map((boxName, index) => (
          <Link key={index} href={pageMap[boxName] || '/'}>
            <div
              style={{
                height: '300px',
                width: '300px',
                backgroundColor: '#07093A',
                color: '#fff',
                fontSize: '25px',
                textAlign: 'center',
                lineHeight: '300px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              {boxName}
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div > div {
            width: 100%;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
}
