import React from 'react';

const JsonLd = () => {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Curt',
        url: 'https://curt.vercel.app',
        description:
            'Stream knowledge directly into your mind with RSVP technology. No eye movements. No distractions. Just pure signal.',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Any',
        author: {
            '@type': 'Person',
            name: 'Anant Singhal',
            url: 'https://github.com/GithubAnant',
            sameAs: [
                'https://twitter.com/anant_hq',
                'https://www.linkedin.com/in/anantsinghal1',
            ],
        },
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
};

export default JsonLd;
