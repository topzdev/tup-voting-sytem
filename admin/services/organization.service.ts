type OrganizationLogo = {
  id: number;
  public_id: string;
  url: string;
  service: string;
};

export type Organization = {
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  id: number;
  slug: string;
  ticker: string;
  title: string;
  description?: string;
  archive: boolean;
  themePrimary: string;
  themeSecondary: string;
  logo: OrganizationLogo;
};

export const organizationDummy: Organization[] = [
  {
    created_at: "2021-11-27T15:36:17.596Z",
    updated_at: "2021-11-27T15:36:17.596Z",
    deleted_at: null,
    id: 2,
    slug: "comselect",
    ticker: "COMSELECT",
    title: "Commission on Student Elections TUP Manila",
    description: "Test description",
    archive: false,
    themePrimary: "blue",
    themeSecondary: "pink",
    logo: {
      id: 2,
      public_id: "tup_voting_dev/org_photos/rhnkpclfn4f5ywsxnl7m",
      url: "https://res.cloudinary.com/topzdev/image/upload/v1638027377/tup_voting_dev/org_photos/rhnkpclfn4f5ywsxnl7m.jpg",
      service: "cld",
    },
  },
  {
    created_at: "2021-11-27T16:28:41.964Z",
    updated_at: "2021-11-27T16:41:38.297Z",
    deleted_at: null,
    id: 7,
    slug: "Test Slug Update 6",
    ticker: "Test Ticker Update 3",
    title: "Test Title Update 3",
    description: "Test Desc Update 3",
    archive: false,
    themePrimary: "blue",
    themeSecondary: "pink",
    logo: {
      id: 8,
      public_id: "tup_voting_dev/org_photos/n451ae6r66vyvmrx8usu",
      url: "http://res.cloudinary.com/topzdev/image/upload/v1638032453/tup_voting_dev/org_photos/n451ae6r66vyvmrx8usu.jpg",
      service: "cld",
    },
  },
  {
    created_at: "2021-11-27T16:28:41.964Z",
    updated_at: "2021-11-27T17:04:05.931Z",
    deleted_at: null,
    id: 3,
    slug: "Test Slug Update 3",
    ticker: "Test Ticker Update 3",
    title: "Test Title Update 3",
    description: "Test Desc Update 3",
    archive: false,
    themePrimary: "blue",
    themeSecondary: "pink",
    logo: {
      id: 9,
      public_id: "tup_voting_dev/org_photos/gv03vdbr6bjkimqtaomc",
      url: "http://res.cloudinary.com/topzdev/image/upload/v1638032593/tup_voting_dev/org_photos/gv03vdbr6bjkimqtaomc.jpg",
      service: "cld",
    },
  },
  {
    created_at: "2021-11-27T15:27:46.038Z",
    updated_at: "2021-11-27T17:12:24.102Z",
    deleted_at: null,
    id: 1,
    slug: "Test Slug Update 2",
    ticker: "Test Ticker Update 3",
    title: "Test Title Update 3",
    description: "Test Desc Update 3",
    archive: false,
    themePrimary: "blue",
    themeSecondary: "pink",
    logo: {
      id: 10,
      public_id: "tup_voting_dev/org_photos/wsppcztv1s0qv6o07p9k",
      url: "http://res.cloudinary.com/topzdev/image/upload/v1638032740/tup_voting_dev/org_photos/wsppcztv1s0qv6o07p9k.jpg",
      service: "cld",
    },
  },
  {
    created_at: "2021-11-27T16:28:41.964Z",
    updated_at: "2021-11-28T06:50:20.123Z",
    deleted_at: null,
    id: 6,
    slug: "test-slug-update",
    ticker: "Test Ticker Update 4",
    title: "Test Title Update 4",
    description: "Test Desc Update 4",
    archive: false,
    themePrimary: "blue",
    themeSecondary: "pink",
    logo: {
      id: 12,
      public_id: "tup_voting_dev/org_photos/jcyu7nniftwrkvwnmbek",
      url: "http://res.cloudinary.com/topzdev/image/upload/v1638079308/tup_voting_dev/org_photos/jcyu7nniftwrkvwnmbek.png",
      service: "cld",
    },
  },
];
