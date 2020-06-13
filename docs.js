const Docma = require("docma");

const config = {
  dest: "./docs",
  debug: 16,
  clean: true,
  app: {
    title: "Endb",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width,initial-scale=1.0" },
    ],
    base: "/",
    entrance: "content:readme",
    routing: Docma.RoutingMethod.PATH,
    server: Docma.ServerType.GITHUB,
  },
  src: ["packages/**/src/*.js", "./README.md"],
  template: {
    options: {
      title: "Endb",
      navbar: {
        menu: [
          { label: "Home", href: "/" },
          { label: "Documentation", href: "/api", iconClass: "fas fa-book" },
          {
            label: "GitHub",
            href: "https://github.com/chroventer/endb",
            iconClass: "fab fa-github",
            target: "_blank",
          },
        ],
      },
      sidebar: {
        enabled: true,
        outline: "tree",
      },
    },
  },
  markdown: { sanitize: true },
};

Docma.create()
  .build(config)
  .then(() => console.log("Successfully build the documentation."))
  .catch(console.error);
