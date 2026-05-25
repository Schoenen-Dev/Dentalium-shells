export default function DynamicPage({ params }) {

  const pages = {

    "faq-v1": {
      title: "Frequently Asked Questions",

      sections: [

        {
          heading: "What are Dentalium Shells?",
          content:
            "Dentalium shells are natural tusk-shaped sea shells commonly used for jewelry making, crafts, decorations, and traditional ornaments.",
        },

        {
          heading: "Are Dentalium Shells Natural?",
          content:
            "Yes. Our dentalium shells are naturally sourced, cleaned carefully, and prepared for decorative and craft purposes.",
        },

        {
          heading: "Do You Provide International Shipping?",
          content:
            "Yes, we provide worldwide shipping with secure packaging and reliable delivery services.",
        },

      ],
    },

    "privacy-policy-2": {
      title: "Privacy Policy",

      sections: [

        {
          heading: "Who We Are",
          content:
            "Our website address is: https://dentaliumshells.com",
        },

        {
          heading: "Information Collection",
          content:
            "We collect customer information including name, email, phone number, and shipping address for order processing and support.",
        },

      ],
    },

    "returns-exchanges": {
      title: "Return & Refund Policy",

      sections: [

        {
          heading: "No Refund | No Exchange Policy",
          content:
            "All products sold by Premium Dentalium Shells are natural sea shells. All sales are final and we do not offer refunds or exchanges.",
        },

        {
          heading: "Natural Product Disclaimer",
          content:
            "Variations in size, texture, thickness, color, or minor marks are natural characteristics of sea shells and not defects.",
        },

      ],
    },

    shipping: {
      title: "Shipping Policy",

      sections: [

        {
          heading: "Delivery Timeline",
          content:
            "Orders usually take 20–25 business days depending on customs procedures and destination country.",
        },

        {
          heading: "International Shipping",
          content:
            "We provide worldwide shipping with secure packaging and tracking support.",
        },

      ],
    },

  terms: {
    title: "Terms & Conditions",

    sections: [

      {
        heading: "General Use",
        content:
          "By using this website, you confirm that you are at least 18 years old or using the site under parental supervision.",
      },

      {
        heading: "Product Information",
        content:
          "Dentalium shells are natural products and slight variations in shape, color, and size are normal.",
      },

      {
        heading: "Orders & Payments",
        content:
          "Orders are subject to product availability and payment confirmation.",
      },

    ],
  },

};

  const page = pages[params.slug];

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center text-4xl">
        Page Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20 px-4">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-serif text-center text-deep mb-16">
          {page.title}
        </h1>

        <div className="space-y-6">

          {page.sections.map((item, index) => (

            <div
              key={index}
              className="border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition"
            >

              <h2 className="text-2xl font-semibold text-deep mb-4">
                {item.heading}
              </h2>

              <p className="text-gray-600 leading-8 text-lg">
                {item.content}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}