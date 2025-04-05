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
}
