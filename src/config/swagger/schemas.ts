export const schemas = {
  Lesson: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      notes: { type: 'string', nullable: true },
      materialId: { type: 'integer' },
      sectionId: { type: 'integer' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  LessonWithMaterial: {
    allOf: [
      { $ref: '#/components/schemas/Lesson' },
      {
        type: 'object',
        properties: {
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
          },
        },
      },
    ],
  },
  LessonWithSection: {
    allOf: [
      { $ref: '#/components/schemas/Lesson' },
      {
        type: 'object',
        properties: {
          Section: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              description: { type: 'string', nullable: true },
              classroomId: { type: 'integer' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    ],
  },
  CreateLessonInput: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      notes: { type: 'string', maxLength: 5000, nullable: true },
      sectionId: { type: 'integer' },
    },
    required: ['name', 'sectionId'],
  },
  UpdateLessonInput: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      notes: { type: 'string', maxLength: 5000, nullable: true },
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
}
