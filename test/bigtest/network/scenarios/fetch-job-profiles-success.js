export default server => {
  server.create('job-profile', {
    id: 'b38e006e-99dd-11ea-bb37-0242ac130008',
    name: 'A Lorem impsum 1',
    destination: 'fileSystem',
    description: 'Job profile description',
    userInfo: {
      firstName: 'Donald',
      lastName: 'S',
      userName: 'diku_admin',
    },
    mappingProfileId: '25d81cbe-9686-11ea-bb37-0242ac130002',
    metadata: {
      createdDate: '2018-12-04T11:22:07Z',
      createdByUserId: 'dee12548-9cee-45fa-bbae-675c1cc0ce3b',
      createdByUsername: 'janedoeuser',
      updatedDate: '2018-12-04T13:28:54Z',
      updatedByUserId: 'dee12548-9cee-45fa-bbae-675c1cc0ce3b',
      updatedByUsername: '',
    },
  });

  server.createList('job-profile', 2);

  server.get('/data-export/jobProfiles', schema => {
    return schema.jobProfiles.all();
  });
};
