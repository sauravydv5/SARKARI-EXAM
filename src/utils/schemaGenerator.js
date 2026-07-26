// Schema generators for structured data markup

export const generateJobPostingSchema = (post) => {
  if (!post) return null;

  const dates = post.importantDates || {};
  
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: post.title,
    description: post.shortDescription || post.title,
    datePosted: post.publishedAt,
    validThrough: dates.lastDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: post.organization || 'Government Organization',
      sameAs: 'https://sarkarijobhud.website',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
    },
    baseSalary: post.salary
      ? {
          '@type': 'PriceSpecification',
          priceCurrency: 'INR',
          price: post.salary,
        }
      : undefined,
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'IN',
    },
  };
};

export const generateFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url,
    })),
  };
};

export const generateAggregateRatingSchema = (aggregateRating) => {
  if (!aggregateRating) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: aggregateRating.ratingValue,
    ratingCount: aggregateRating.ratingCount,
    bestRating: aggregateRating.bestRating || 5,
    worstRating: aggregateRating.worstRating || 1,
  };
};

export const generateSearchActionSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sarkari Job Hub',
    url: 'https://sarkarijobhud.website',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://sarkarijobhud.website/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

export const generateArticleSchema = (article) => {
  if (!article) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Organization',
      name: article.author?.name || 'Sarkari Job Hub',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sarkari Job Hub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sarkarijobhud.website/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
};

export const generateCollegeSchema = (college) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: college?.name || 'Government Institution',
    description: college?.description,
    url: college?.url,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: college?.state,
    },
  };
};
