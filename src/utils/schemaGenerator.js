// Schema generators for structured data markup

function toSchemaDate(value) {
  if (!value) return undefined;
  const text = String(value).trim();
  if (!text) return undefined;
  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();

  const match = text.match(/^(\d{1,2})[\s/-]+([A-Za-z]+)[\s/-]+(\d{4})$/);
  if (!match) return undefined;
  const normalized = new Date(`${match[1]} ${match[2]} ${match[3]} UTC`);
  return Number.isNaN(normalized.getTime()) ? undefined : normalized.toISOString();
}

function toNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return undefined;
  const number = Number(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(number) ? number : undefined;
}

function buildSalary(salary) {
  if (!salary) return undefined;
  if (typeof salary === 'object') {
    const minValue = toNumber(salary.minValue);
    const maxValue = toNumber(salary.maxValue);
    const value = toNumber(salary.value);
    if (minValue === undefined && maxValue === undefined && value === undefined) return undefined;
    return {
      '@type': 'MonetaryAmount',
      currency: salary.currency || 'INR',
      value: {
        '@type': 'QuantitativeValue',
        ...(value !== undefined ? { value } : {}),
        ...(minValue !== undefined ? { minValue } : {}),
        ...(maxValue !== undefined ? { maxValue } : {}),
        ...(salary.unitText ? { unitText: salary.unitText } : {}),
      },
    };
  }

  const value = toNumber(salary);
  return value === undefined
    ? undefined
    : {
        '@type': 'MonetaryAmount',
        currency: 'INR',
        value: { '@type': 'QuantitativeValue', value },
      };
}

export const generateJobPostingSchema = (post) => {
  // JobPosting markup is only valid for a live vacancy. Results, answer keys,
  // admit cards and generic service pages must not be labelled as job offers.
  if (!post || post.category !== 'latest-job' || !post.links?.officialWebsite) return null;

  const dates = post.importantDates || {};
  const location = post.jobLocation || post.location || {};
  const locationName = typeof location === 'string' ? location : location.name;
  const address = typeof location === 'object' ? location.address || {} : {};
  const officialWebsite = post.links?.officialWebsite || post.officialWebsite;
  const description = String(post.content || post.shortDescription || post.title)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const hasJobLocation = Boolean(address.addressLocality || location.city);

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: post.title,
    description,
    datePosted: toSchemaDate(post.publishedAt),
    ...(toSchemaDate(dates.lastDate) ? { validThrough: toSchemaDate(dates.lastDate) } : {}),
    ...(post.employmentType ? { employmentType: post.employmentType } : {}),
    hiringOrganization: {
      '@type': 'Organization',
      name: post.organization || 'Government Organization',
      ...(officialWebsite ? { sameAs: officialWebsite, url: officialWebsite } : {}),
    },
    ...(hasJobLocation
      ? {
          jobLocation: {
            '@type': 'Place',
            ...(locationName ? { name: locationName } : {}),
            address: {
              '@type': 'PostalAddress',
              ...(address.streetAddress ? { streetAddress: address.streetAddress } : {}),
              ...(address.addressLocality || location.city ? { addressLocality: address.addressLocality || location.city } : {}),
              ...(address.addressRegion || location.state ? { addressRegion: address.addressRegion || location.state } : {}),
              addressCountry: address.addressCountry || 'IN',
            },
          },
        }
      : {}),
    ...(buildSalary(post.salary) ? { baseSalary: buildSalary(post.salary) } : {}),
    ...(post.applicantLocationRequirements
      ? {
          applicantLocationRequirements: {
            '@type': 'Country',
            name: post.applicantLocationRequirements,
          },
        }
      : {
          applicantLocationRequirements: {
            '@type': 'Country',
            name: 'IN',
          },
        }),
    ...(post.industry ? { industry: post.industry } : {}),
    ...(post.educationRequirements || post.qualification
      ? { educationRequirements: post.educationRequirements || post.qualification }
      : {}),
    ...(post.identifier ? { identifier: post.identifier } : {}),
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
    url: 'https://sarkarijobhub.website',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://sarkarijobhub.website/search?q={search_term_string}',
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
        url: 'https://sarkarijobhub.website/logo.png',
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
