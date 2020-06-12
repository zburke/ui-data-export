export const mappingProfileWithTransformations = {
  id: '25d81cbe-9686-11ea-bb37-0242ac130002',
  name: 'AP Holdings 1',
  description: 'AP Holdings 1 description',
  recordTypes: ['HOLDINGS'],
  transformations: [{
    fieldId: 'callNumber',
    path: '$.holdings[*].callNumber',
    enabled: true,
    transformation: 'test',
    recordType: 'HOLDINGS',
  }],
  userInfo: {
    firstName: 'Donald',
    lastName: 'S',
    userName: 'system_process',
  },
  outputFormat: 'MARC',
  metadata: {
    createdDate: '2018-12-04T01:29:36.531+0000',
    updatedDate: '2018-12-04T01:29:36.531+0000',
  },
};

export const mappingProfile = {
  id: '25d81cbe-9686-11ea-bb37-0242ac130005',
  name: 'AP Holdings & Items',
  description: null,
  recordTypes: ['HOLDINGS', 'ITEM'],
  transformations: [],
  outputFormat: 'MARC',
  metadata: {
    createdDate: '2018-12-04T01:29:36.531+0000',
    updatedDate: '2018-12-04T01:29:36.531+0000',
  },
};

export default server => {
  server.create('mapping-profile', mappingProfileWithTransformations);
  server.create('mapping-profile', mappingProfile);

  server.get('/data-export/mappingProfiles', schema => {
    const mappingProfiles = schema.mappingProfiles.all();

    return mappingProfiles;
  });
};
