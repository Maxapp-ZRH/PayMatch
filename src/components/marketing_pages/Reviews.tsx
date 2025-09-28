'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/marketing_pages/Container';

interface Review {
  title: string;
  body: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

const reviews: Array<Review> = [
  {
    title: 'Finally, Swiss invoicing made simple.',
    body: 'As a freelancer in Zürich, I was struggling with QR-bill compliance. PayMatch made it effortless - I can create professional invoices in minutes.',
    author: 'Maria Schmidt, Freelancer',
    rating: 5,
  },
  {
    title: 'Payment reconciliation is a game-changer.',
    body: 'Uploading CAMT files and having payments automatically matched to invoices saves me hours every week. My accountant loves the clean data.',
    author: 'Thomas Müller, SME Owner',
    rating: 5,
  },
  {
    title: 'Perfect for Swiss businesses.',
    body: 'The multi-currency support (CHF/EUR) and Swiss VAT calculations are exactly what we needed. Finally, an invoicing tool built for our market.',
    author: 'Anna Weber, Accounting Firm',
    rating: 5,
  },
  {
    title: 'Professional and compliant.',
    body: 'Every invoice looks professional and meets Swiss standards. Clients pay faster because they trust the QR-bill format. Highly recommended!',
    author: 'David Fischer, Consultant',
    rating: 5,
  },
  {
    title: 'Saves me 5 hours per week.',
    body: 'The automated reminders and payment tracking features are incredible. I can focus on my business instead of chasing payments.',
    author: 'Sarah Zimmermann, Service Provider',
    rating: 5,
  },
  {
    title: 'Best invoicing tool for Switzerland.',
    body: 'I tried several other platforms, but none understood Swiss requirements like PayMatch. The QR-bill generation is flawless.',
    author: 'Michael Keller, Agency Owner',
    rating: 5,
  },
  {
    title: 'Team collaboration is excellent.',
    body: 'My team can manage invoices together seamlessly. The real-time updates and notifications keep everyone in sync.',
    author: 'Lisa Brunner, Operations Manager',
    rating: 5,
  },
  {
    title: 'GDPR compliance built-in.',
    body: 'Knowing my client data is secure and GDPR compliant gives me peace of mind. The security features are enterprise-grade.',
    author: 'Robert Huber, Data-Sensitive Business',
    rating: 5,
  },
  {
    title: 'Financial reporting is comprehensive.',
    body: 'The reporting features help me understand my cash flow better. Exporting data for my accountant is seamless.',
    author: 'Christine Wagner, Financial Controller',
    rating: 5,
  },
  {
    title: 'Customer support is outstanding.',
    body: 'When I had questions about Swiss VAT rules, their support team was incredibly helpful and knowledgeable about local regulations.',
    author: 'Peter Lehmann, New Business Owner',
    rating: 5,
  },
  {
    title: 'Worth every Swiss Franc.',
    body: 'The time I save on invoicing and payment tracking more than pays for the subscription. It has transformed my business operations.',
    author: 'Nicole Graf, Professional Services',
    rating: 5,
  },
  {
    title: 'Intuitive and powerful.',
    body: 'The interface is clean and easy to use, but the features are comprehensive. Perfect balance of simplicity and functionality.',
    author: 'Stefan Roth, Tech Consultant',
    rating: 5,
  },
  {
    title: 'Swiss precision at its finest.',
    body: 'PayMatch embodies Swiss quality - precise, reliable, and efficient. Everything works exactly as promised.',
    author: 'Andrea Meier, Quality Manager',
    rating: 5,
  },
  {
    title: 'Game-changer for my practice.',
    body: 'As a fiduciary, I manage multiple clients. PayMatch makes it easy to keep everything organized and compliant.',
    author: 'Markus Schneider, Fiduciary',
    rating: 5,
  },
];

function StarIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function StarRating({ rating }: { rating: Review['rating'] }) {
  return (
    <div className="flex">
      {[...Array(5).keys()].map((index) => (
        <StarIcon
          key={index}
          className={clsx(
            'h-5 w-5',
            rating > index ? 'fill-teal-600' : 'fill-gray-300'
          )}
        />
      ))}
    </div>
  );
}

function Review({
  title,
  body,
  author,
  rating,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'figure'>, keyof Review> & Review) {
  const animationDelay = useMemo(() => {
    const possibleAnimationDelays = [
      '0s',
      '0.1s',
      '0.2s',
      '0.3s',
      '0.4s',
      '0.5s',
    ];
    return possibleAnimationDelays[
      Math.floor(Math.random() * possibleAnimationDelays.length)
    ];
  }, []);

  return (
    <figure
      className={clsx(
        'animate-fade-in rounded-3xl bg-white p-6 opacity-0 shadow-md shadow-gray-900/5',
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <blockquote className="text-gray-900">
        <StarRating rating={rating} />
        <p className="mt-4 text-lg/6 font-semibold before:content-['“'] after:content-['”']">
          {title}
        </p>
        <p className="mt-3 text-base/7">{body}</p>
      </blockquote>
      <figcaption className="mt-3 text-sm text-gray-600 before:content-['–_']">
        {author}
      </figcaption>
    </figure>
  );
}

function splitArray<T>(array: Array<T>, numParts: number) {
  const result: Array<Array<T>> = [];
  for (let i = 0; i < array.length; i++) {
    const index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }
  return result;
}

function ReviewColumn({
  reviews,
  className,
  reviewClassName,
  msPerPixel = 0,
}: {
  reviews: Array<Review>;
  className?: string;
  reviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
}) {
  const columnRef = useRef<React.ElementRef<'div'>>(null);
  const [columnHeight, setColumnHeight] = useState(0);
  const duration = `${columnHeight * msPerPixel}ms`;

  useEffect(() => {
    if (!columnRef.current) {
      return;
    }

    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight ?? 0);
    });

    resizeObserver.observe(columnRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={columnRef}
      className={clsx('animate-marquee space-y-8 py-4', className)}
      style={{ '--marquee-duration': duration } as React.CSSProperties}
    >
      {reviews.concat(reviews).map((review, reviewIndex) => (
        <Review
          key={reviewIndex}
          aria-hidden={reviewIndex >= reviews.length}
          className={reviewClassName?.(reviewIndex % reviews.length)}
          {...review}
        />
      ))}
    </div>
  );
}

function ReviewGrid() {
  const containerRef = useRef<React.ElementRef<'div'>>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  const columns = splitArray(reviews, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = splitArray(columns[2], 2);

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 mt-16 grid h-196 max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      {isInView && (
        <>
          <ReviewColumn
            reviews={[...column1, ...column3.flat(), ...column2]}
            reviewClassName={(reviewIndex) =>
              clsx(
                reviewIndex >= column1.length + column3[0].length &&
                  'md:hidden',
                reviewIndex >= column1.length && 'lg:hidden'
              )
            }
            msPerPixel={10}
          />
          <ReviewColumn
            reviews={[...column2, ...column3[1]]}
            className="hidden md:block"
            reviewClassName={(reviewIndex) =>
              reviewIndex >= column2.length ? 'lg:hidden' : ''
            }
            msPerPixel={15}
          />
          <ReviewColumn
            reviews={column3.flat()}
            className="hidden lg:block"
            msPerPixel={10}
          />
        </>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-gray-50" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-gray-50" />
    </div>
  );
}

export function Reviews() {
  const t = useTranslations('reviews');

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="pt-20 pb-16 sm:pt-32 sm:pb-24"
    >
      <Container>
        <h2
          id="reviews-title"
          className="text-3xl font-medium tracking-tight text-gray-900 sm:text-center"
        >
          {t('title')}
        </h2>
        <p className="mt-2 text-lg text-gray-600 sm:text-center">
          {t('subtitle')}
        </p>
        <ReviewGrid />
      </Container>
    </section>
  );
}
