const globalRules = {
  start_date(close_date: any) {
    return [
      (v: any) => !!v || "Start Date is required",
      (v: any) =>
        new Date(v) < new Date(close_date) ||
        "Starting date must be past of Close date",
    ];
  },
  close_date: [
    (v: any) => !!v || "Close date is required",
    (v: any) =>
      new Date(v) > new Date() ||
      "Close date must be more than the current date",
  ],

  slug: [
    (v: any) => !!v || "Slug is required",
    (v: any) =>
      /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(v) || "Slug must be valid",
  ],
};

export default globalRules;
