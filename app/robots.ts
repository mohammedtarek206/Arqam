import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/instructor/', '/dashboard/'],
        },
        sitemap: 'https://www.arqamacademic.com/sitemap.xml',
    };
}
