export const schemas = {
  Lesson: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      notes: { type: 'string', nullable: true },
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
      notes: 'Basic concepts',
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
      notes: { type: 'string', maxLength: 5000, nullable: true },
      sectionId: { type: 'integer' },
    },
    required: ['name', 'sectionId'],
    example: {
      name: 'Intro to Algebra',
      notes: 'Basic concepts',
      sectionId: 1,
    },
  },

  UpdateLessonInput: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      notes: { type: 'string', maxLength: 5000, nullable: true },
    },
    example: {
      name: 'Updated Lesson Name',
      notes: 'Updated notes for this lesson.',
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
  Quiz: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      duration: { type: 'integer' },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      grade: { type: 'string' },
      classroomId: { type: 'integer' },
      active: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      questionCount: { type: 'integer' },
      QuizQuestions: {
        type: 'array',
        items: { $ref: '#/components/schemas/QuizQuestion' },
      },
    },
    example: {
      id: 1,
      name: 'Math Quiz 1',
      duration: 60,
      startDate: '2025-06-14T10:00:00.000Z',
      endDate: '2025-06-14T11:00:00.000Z',
      grade: 'A',
      classroomId: 1,
      active: true,
      createdAt: '2025-06-13T23:14:00.000Z',
      updatedAt: '2025-06-13T23:14:00.000Z',
      questionCount: 2,
      QuizQuestions: [
        {
          id: 1,
          quizId: 1,
          questionId: 1,
          points: 10,
          Question: {
            id: 1,
            questionHeader: 'What is 2+2?',
            options: ['3', '4', '5'],
            answer: '4',
            classroomId: 1,
            createdAt: '2025-06-13T23:00:00.000Z',
            updatedAt: '2025-06-13T23:00:00.000Z',
          },
        },
        {
          id: 2,
          quizId: 1,
          questionId: 2,
          points: 15,
          Question: {
            id: 2,
            questionHeader: 'What is the capital of France?',
            options: ['Paris', 'London', 'Berlin'],
            answer: 'Paris',
            classroomId: 1,
            createdAt: '2025-06-13T23:00:00.000Z',
            updatedAt: '2025-06-13T23:00:00.000Z',
          },
        },
      ],
    },
  },

  QuizWithoutQuestions: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      duration: { type: 'integer' },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      grade: { type: 'string' },
      classroomId: { type: 'integer' },
      active: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    example: {
      id: 4,
      name: 'Science Quiz',
      duration: 45,
      startDate: '2023-10-05T14:00:00.000Z',
      endDate: '2023-10-05T15:00:00.000Z',
      grade: 'A',
      classroomId: 1,
      active: true,
      createdAt: '2025-06-12T01:09:02.493Z',
      updatedAt: '2025-06-12T01:09:02.493Z',
    },
  },

  QuizQuestion: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      quizId: { type: 'integer' },
      questionId: { type: 'integer' },
      points: { type: 'integer' },
      Question: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          questionHeader: { type: 'string', nullable: true },
          options: { type: 'array', items: { type: 'string' } },
          answer: { type: 'string' },
          classroomId: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },

  CreateQuizWithQuestionsInput: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      duration: { type: 'integer', minimum: 1 },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      grade: { type: 'string', minLength: 1 },
      classroomId: { type: 'integer', minimum: 1 },
      active: { type: 'boolean' },
      quizQuestions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            questionId: { type: 'integer', minimum: 1 },
            points: { type: 'integer', minimum: 1 },
          },
          required: ['questionId', 'points'],
        },
      },
    },
    required: [
      'name',
      'duration',
      'startDate',
      'endDate',
      'grade',
      'classroomId',
      'active',
    ],
    example: {
      name: 'Math Quiz 1',
      duration: 60,
      startDate: '2025-06-14T10:00:00.000Z',
      endDate: '2025-06-14T11:00:00.000Z',
      grade: 'A',
      classroomId: 1,
      active: true,
      quizQuestions: [
        { questionId: 1, points: 10 },
        { questionId: 2, points: 15 },
      ],
    },
  },

  UpdateQuizInput: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      duration: { type: 'integer', minimum: 1 },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      grade: { type: 'string', minLength: 1 },
      active: { type: 'boolean' },
      quizQuestions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            questionId: { type: 'integer', minimum: 1 },
            points: { type: 'integer', minimum: 1 },
          },
          required: ['questionId', 'points'],
        },
      },
    },
    example: {
      name: 'Updated Math Quiz',
      duration: 90,
      startDate: '2025-06-14T11:00:00.000Z',
      endDate: '2025-06-14T12:30:00.000Z',
      grade: 'B',
      active: false,
      quizQuestions: [{ questionId: 3, points: 20 }],
    },
  },
}
