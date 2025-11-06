# MYTM-SAY API - Community Learning Platform

A Node.js/TypeScript API backend for a social learning platform that combines community-driven discussions with structured educational content.

## Overview

MYTM-SAY is a full-featured platform enabling users to create communities, participate in forum discussions, and access structured learning content through classrooms and quizzes. The system implements a three-tier architecture (Controllers → Services → Repositories) with PostgreSQL via Prisma ORM.

## Core Features

### Social & Community Features

- **Community Management**: Create public/private communities with tag-based discovery and recommendations
- **Forum Discussions**: Organize posts within community forums with voting mechanics
- **Threaded Comments**: Nested comment system with self-referencing parent-child relationships
- **Engagement System**: Three-state voting (UPVOTE/DOWNVOTE/NONE) for posts and comments
- **Contribution Tracking**: Automatic activity tracking for gamification and user profiles

### Learning & Education Features

- **Classrooms**: Structured learning containers within communities
- **Lessons & Materials**: Support for VIDEO, AUDIO, IMG, DOC, and FILE content types with progress tracking
- **Quiz System**: Time-bound assessments with question banks and automatic scoring
- **Progress Tracking**: Per-user completion tracking for lessons and classrooms

### Access Control

Role-based authorization with three levels:

- **OWNER**: Full community control
- **MODERATOR**: Content management and moderation
- **MEMBER**: Basic participation rights

Authorization is enforced at the service layer using `CommunityMembersRepo.getUserRoleInCommunity()`

## Architecture

### Three-Tier Pattern

```
Controllers (API Layer)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
Prisma ORM → PostgreSQL
```

### Content Hierarchy

```
Community
  ├── Forums → Posts → Comments
  └── Classrooms → Sections → Lessons → Materials
```

## Key Technical Patterns

- **Batch Query Optimization**: Vote aggregation uses single queries to prevent N+1 problems
- **Transaction Safety**: Atomic updates for quiz questions and related data
- **Cascade Handling**: Manual cleanup of dependent records before deletion
- **Flexible Discovery**: Community recommendations based on user profile tags

## Community Features

### Join Requests

Private communities require approval through a join request system. Public communities allow instant membership.

```typescript
// Example: Join request handling for public vs private communities
async function createJoinRequest(data: JoinRequestType) {
  const community = await CommunityRepo.findById(data.communityId)

  if (!community) throw new APIError('Community not found', 404)

  if (community.isPublic) {
    // Public communities: instant membership
    const CommunityMembers = await CommunityMembersRepo.addUserToCommunity({
      userId: data.userId,
      communityId: data.communityId,
      Role: Role.MEMBER,
    })
    return null
  }
  
  // Private communities: create join request
  return JoinRequestRepo.create(data)
}
```

### Favorites

Users can favorite communities for quick access.

```typescript
async addFavoriteCommunity(userId: number, communityId: number) {
  return prisma.favoriteCommunities.create({
    data: {
      userId,
      communityId,
    },
  })
}
```

### Member Management

- View all community members with roles
- Assign moderator roles
- Leave communities (owners cannot leave)

```typescript
// Example: Assigning moderator role
async assignModRole(userId: number, communityId: number) {
  const communities = await prisma.communityMembers.update({
    where: { communityId_userId: { communityId, userId } },
    data: { Role: 'MODERATOR' },
  })
  return communities
}
```

## Learning Features

### Lesson Management

Lessons support multiple material types and track completion per user:

```typescript
// Create lesson with materials
async createWithMaterial(data: z.infer<typeof CreateLessonWithMaterialSchema>) {
  const lesson = await prisma.lesson.create({
    data: {
      ...data.lesson,
      Materials: {
        create: data.materials,
      },
    },
    include: { Materials: true },
  })
  return lesson
}

// Track lesson completion
async findCompletedLessonForUser(lessonId: number, userId: number) {
  const completedLesson = await prisma.completedLessons.findFirst({
    where: {
      lessonId,
      userId,
    },
  })
  return completedLesson
}
```

### Community Recommendations

Tag-based recommendation system:

```typescript
async getRecommendedCommunities(userTagIds: number[]) {
  const recommendedCommunities = await prisma.community.findMany({
    where: {
      Tags: {
        some: {
          id: { in: userTagIds },
        },
      },
    },
    include: { Tags: true, Owner: true },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return recommendedCommunities
}
```

## Tech Stack

- **TypeScript** - Type safety and enhanced developer experience
- **Node.js** - Runtime environment
- **Express.js** - Web framework for API routing
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary database
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mytm_say"
JWT_SECRET="your-secret-key"
PORT=3000
```

## Project Structure

```
src/
├── controllers/     # API endpoint handlers
├── services/        # Business logic layer
├── repos/          # Data access layer
├── models/         # Prisma schema and types
├── middleware/     # Auth, validation, error handling
└── utils/          # Helper functions
```

## API Documentation

For detailed API documentation, explore the wiki pages:

- [Social & Community Features](/wiki/MYTM-SAY/api#3)
- [Learning & Education Features](/wiki/MYTM-SAY/api#4)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

[Add your license information here]

## Contact

[Add contact information or links to project maintainers]

---

**Note**: This README is based on the current codebase structure focusing on the social and learning features. The system demonstrates a well-organized architecture with clear separation of concerns, comprehensive authorization checks, and efficient data access patterns.
