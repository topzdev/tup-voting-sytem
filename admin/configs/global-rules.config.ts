const globalRules = {
  start_date(close_date: any) {
    return [
      (v: Date) => !!v || "Start Date is required",
      (v: Date) => !!v || "Start Date is required",
      (v: Date) =>
        new Date(v).getTime() > new Date().getTime() ||
        "Starting date must ahead from the current date.",
      (v: Date) =>
        new Date(v).getTime() < new Date(close_date).getTime() ||
        "Starting date must be past of election closing date.",
    ];
  },
  close_date(start_date: any) {
    return [
      (v: Date) => !!v || "Close date is required",
      (v: Date) =>
        new Date(v).getTime() >= new Date(start_date).getTime() ||
        "Closing date must be over starting date, give some allowance to have running phase.",
    ];
  },

  slug: [
    (v: any) => !!v || "Slug is required",
    (v: any) =>
      /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(v) || "Slug must be valid",
  ],
};

export default globalRules;
