// https://github.dev/kentcdodds/kentcdodds.com
export type CustomHandle = {
  /** this just allows us to identify routes more directly rather than relying on pathnames */
  id: string;
  // getSitemapEntries?:
  //   | ((
  //       request: Request
  //     ) =>
  //       | Promise<Array<KCDSitemapEntry | null> | null>
  //       | Array<KCDSitemapEntry | null>
  //       | null)
  //   | null;
};
