export const schemas = {
Lesson: {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    notes: {
      type: 'array',
      items: { type: 'string' },
      nullable: true,
    },
    sectionId: { type: 'integer' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    materials: {
      type: 'array',
      items: { $ref: '#/components/schemas/Material' },
    },
  },
  example: {
    id: 1,
    name: 'Intro to Algebra',
    notes: ['Basic concepts', 'Bring textbook'],
    sectionId: 1,
    createdAt: '2025-04-03T12:24:27.161Z',
    updatedAt: '2025-04-03T12:24:27.161Z',
    materials: [
      {
        id: 1,
        materialType: 'VIDEO',
        fileUrl: 'https://example.com/video.mp4',
        createdAt: '2025-04-22T12:22:14.918Z',
        updatedAt: '2025-04-22T12:22:14.918Z',
        lessonId: 1,
      },
    ],
  },
},
  Material: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      materialType: {
        type: 'string',
        enum: ['VIDEO', 'AUDIO', 'IMG', 'DOC', 'FILE'],
      },
      fileUrl: { type: 'string', format: 'uri' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    example: {
      id: 7,
      materialType: 'VIDEO',
      fileUrl: 'https://example.com/video.mp4',
      createdAt: '2025-04-03T12:39:14.561Z',
      updatedAt: '2025-04-03T12:39:14.561Z',
    },
  },

CreateLessonInput: {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    notes: {
      type: 'array',
      items: { type: 'string' },
      nullable: true
    },
    sectionId: { type: 'integer' },
  },
  required: ['name', 'sectionId'],
  example: {
    name: 'Intro to Algebra',
    notes: ['Basic concepts', 'Introductory topics'],
    sectionId: 1,
  },
},


UpdateLessonInput: {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    notes: {
      type: 'array',
      items: { type: 'string' },
      nullable: true
    },
  },
  example: {
    name: 'Updated Lesson Name',
    notes: ['Updated notes for this lesson.', 'Additional explanations'],
  },
},

  CreateMaterialInput: {
    type: 'object',
    properties: {
      materialType: {
        type: 'string',
        enum: ['VIDEO', 'AUDIO', 'IMG', 'DOC', 'FILE'],
      },
      fileUrl: { type: 'string', format: 'uri' },
    },
    required: ['materialType', 'fileUrl'],
    example: {
      materialType: 'VIDEO',
      fileUrl: 'https://example.com/video.mp4',
    },
  },
  Section: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
        nullable: true,
      },
      classroomId: {
        type: 'integer',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
  SectionWithClassroom: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
        nullable: true,
      },
      classroomId: {
        type: 'integer',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
      Classroom: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          coverImg: {
            type: 'string',
          },
          communityId: {
            type: 'integer',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
          progress: {
            type: 'integer',
          },
        },
      },
    },
  },
  CreateSectionInput: {
    type: 'object',
    required: ['name', 'classroomId'],
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
        nullable: true,
      },
      classroomId: {
        type: 'integer',
      },
    },
  },
  UpdateSectionInput: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
        nullable: true,
      },
    },
  },
  Post: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      title: { type: 'string', example: 'Tech Trends 2025' },
      content: {
        type: 'string',
        example: 'A deep dive into the latest technology trends for the year.',
      },
      voteCounter: { type: 'integer', example: 5 },
      attachments: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['https://techcommunity.com/files/trends-2025.pdf'],
      },
      forumId: { type: 'integer', example: 1 },
      authorId: { type: 'integer', example: 1 },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-04-11T06:41:58.470Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-04-11T06:41:58.470Z',
      },
    },
    required: [
      'id',
      'title',
      'content',
      'voteCounter',
      'forumId',
      'authorId',
      'createdAt',
      'updatedAt',
    ],
  },
  Community: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Tech Community' },
      description: { type: 'string', example: 'A place for tech enthusiasts.' },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-04-11T06:25:08.279Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-04-11T06:25:08.279Z',
      },
      coverImgURL: { type: 'string', example: 'https://example.com/cover.jpg' },
      logoImgURL: { type: 'string', example: 'https://example.com/logo.jpg' },
      ownerId: { type: 'integer', example: 1 },
      Classrooms: {
        type: 'array',
        items: { type: 'object' },
        example: [],
      },
      Forums: {
        type: 'object',
        properties: {
          Posts: {
            type: 'array',
            items: { $ref: '#/components/schemas/Post' },
          },
        },
      },
    },
    required: [
      'id',
      'name',
      'description',
      'createdAt',
      'updatedAt',
      'ownerId',
    ],
  },
  FavoriteCommunity: {
    type: 'object',
    properties: {
      userId: { type: 'integer' },
      communityId: { type: 'integer' },
      createdAt: { type: 'string', format: 'date-time' },
      Community: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          bio: { type: 'string', nullable: true },
          coverImgURL: { type: 'string', nullable: true },
          logoImgURL: { type: 'string', nullable: true },
          isPublic: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
    example: {
      userId: 1,
      communityId: 1,
      createdAt: '2025-06-03T17:03:00.000Z',
      Community: {
        id: 1,
        name: 'Tech Community',
        description: 'A place for tech enthusiasts.',
        bio: 'Join us to discuss the latest in tech!',
        coverImgURL: 'https://example.com/cover.jpg',
        logoImgURL: 'https://example.com/logo.jpg',
        isPublic: true,
        createdAt: '2025-04-11T06:25:08.279Z',
      },
    },
  },
}
