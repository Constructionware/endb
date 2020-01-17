'use strict';

const Docma = require('docma');
const Package = require('./package');

Docma
    .create()
    .build({
        app: {
            title: Package.name,
            routing: 'query',
            entrance: 'content:readme',
            base: '/',
            server: Docma.ServerType.GITHUB
        },
        markdown: {
            sanitize: false
        },
        src: [
            { endb: './src/index.js' },
            { readme: './README.md' },
        ],
        dest: './docs',
        template: {
            options: {
                title: Package.name,
                navbar: true,
                sidebar: true,
                navItems: [{
                        label: 'README',
                        href: '?content=readme',
                    },
                    {
                        label: 'Documentation',
                        href: '?api=endb',
                        iconClass: 'ico-book',
                    },
                    {
                        label: 'GitHub',
                        href: Package.repository.url.split('+')[1],
                        target: '_blank',
                        iconClass: 'ico-md ico-github',
                    },
                    {
                        label: 'NPM',
                        href: `https://npmjs.com/package/${Package.name}`,
                        target: '_blank',
                        iconClass: 'ico-npm'
                    }
                ],
            },
        }
    }).catch(console.error);