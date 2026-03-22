import { relations } from "drizzle-orm";
import {
  bigserial,
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const criteriaEnum = pgEnum("criteria", ["tr", "cc", "lr", "gra"]);
export const taskTypeEnum = pgEnum("task_type", ["1a", "1g", "2"]);
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const questionTypeEnum = pgEnum("question_type", ["mcq", "mini_essay"]);
export const usageTypeEnum = pgEnum("usage_type", ["writing_check", "file_upload", "docx_generation"]);

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firebaseUid: text("firebase_uid").unique(),
  paddleCustomerId: text("paddle_customer_id").unique(),
  name: text("name"),
  email: text("email").unique().notNull(),
  password: text("password"),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  isActive: boolean("is_active").default(true),
  role: roleEnum("role").default("user").notNull(),
  avatarFileId: uuid("avatar_file_id"),
  targetBandScore: varchar("target_band_score", { length: 8 }),
  testDate: date("test_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  usage: many(usages),
  subscription: many(subscriptions),
  submissions: many(submissions),
  files: many(files),
  attempts: many(attempts),
  avatarFile: one(files, { fields: [users.avatarFileId], references: [files.id], relationName: "UserAvatar" }),
}));

// ---------------------------------------------------------------------------
// verification_tokens
// ---------------------------------------------------------------------------
export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

// ---------------------------------------------------------------------------
// submissions
// ---------------------------------------------------------------------------
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  taskType: taskTypeEnum("task_type").notNull(),
  prompt: text("prompt").notNull(),
  answer: text("answer").notNull(),
  attachmentId: uuid("attachment_id").references(() => files.id, { onDelete: "set null" }),
  score: jsonb("score"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, { fields: [submissions.userId], references: [users.id] }),
  attachment: one(files, { fields: [submissions.attachmentId], references: [files.id] }),
}));

// ---------------------------------------------------------------------------
// subscriptions
// ---------------------------------------------------------------------------
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  priceId: text("price_id").notNull(),
  productId: text("product_id").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  nextBilledAt: timestamp("next_billed_at", { withTimezone: true }),
  canceledAt: timestamp("canceled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

// ---------------------------------------------------------------------------
// usages
// ---------------------------------------------------------------------------
export const usages = pgTable(
  "usages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    ipAddress: text("ip_address"),
    type: usageTypeEnum("type").notNull(),
    count: integer("count").notNull().default(0),
    resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("usages_user_idx").on(t.userId, t.type), index("usages_ip_idx").on(t.ipAddress, t.type)],
);

export const usagesRelations = relations(usages, ({ one }) => ({
  user: one(users, { fields: [usages.userId], references: [users.id] }),
}));

// ---------------------------------------------------------------------------
// files
// ---------------------------------------------------------------------------
export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  path: text("path").notNull().unique(),
  mimeType: text("mime_type"),
  size: integer("size"),
  name: text("name"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ one, many }) => ({
  user: one(users, { fields: [files.userId], references: [users.id] }),
  usersWithAvatar: many(users, { relationName: "UserAvatar" }),
  submissions: many(submissions),
}));

// ---------------------------------------------------------------------------
// skills
// ---------------------------------------------------------------------------
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  criteria: criteriaEnum("criteria"),
  taskTypes: taskTypeEnum("task_types").array(),
  position: integer("position"),
  isFree: boolean("is_free").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const skillsRelations = relations(skills, ({ many }) => ({
  skillItems: many(skillItems),
}));

// ---------------------------------------------------------------------------
// skillItems
// ---------------------------------------------------------------------------
export const skillItems = pgTable(
  "skill_items",
  {
    id: serial("id").primaryKey(),
    skillId: serial("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // 'lesson' | 'quiz'
    lessonId: serial("lesson_id").references(() => lessons.id, { onDelete: "cascade" }),
    quizId: serial("quiz_id").references(() => quizzes.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
  },
  (t) => [unique("skillItems_skillId_lessonId_quizId_idx").on(t.skillId, t.lessonId, t.quizId)],
);

export const skillItemsRelations = relations(skillItems, ({ one }) => ({
  skill: one(skills, { fields: [skillItems.skillId], references: [skills.id] }),
  lesson: one(lessons, { fields: [skillItems.lessonId], references: [lessons.id] }),
  quiz: one(quizzes, { fields: [skillItems.quizId], references: [quizzes.id] }),
}));

// ---------------------------------------------------------------------------
// lessons
// ---------------------------------------------------------------------------
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const lessonsRelations = relations(lessons, ({ many }) => ({
  skillItems: many(skillItems),
}));

// ---------------------------------------------------------------------------
// quizzes
// ---------------------------------------------------------------------------
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  skillItems: many(skillItems),
  questions: many(questions),
  attempts: many(attempts),
}));

// ---------------------------------------------------------------------------
// questions
// ---------------------------------------------------------------------------
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  quizId: serial("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  type: questionTypeEnum("type").notNull(),
  prompt: text("prompt").notNull(),
  hint: text("hint"),
  options: text("options").array(),
  correctOptions: integer("correct_options").array(),
  correctText: text("correct_text"),
  explanation: text("explanation"),
  position: integer("position"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, { fields: [questions.quizId], references: [quizzes.id] }),
  answers: many(answers),
}));

// ---------------------------------------------------------------------------
// attempts
// ---------------------------------------------------------------------------
export const attempts = pgTable("attempts", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: uuid("user_id").notNull(),
  quizId: uuid("quiz_id").notNull(),
  score: integer("score"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const attemptsRelations = relations(attempts, ({ one, many }) => ({
  user: one(users, { fields: [attempts.userId], references: [users.id] }),
  quiz: one(quizzes, { fields: [attempts.quizId], references: [quizzes.id] }),
  answers: many(answers),
}));

// ---------------------------------------------------------------------------
// answers
// ---------------------------------------------------------------------------
export const answers = pgTable("answers", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  attemptId: bigserial("attempt_id", { mode: "number" })
    .notNull()
    .references(() => attempts.id, { onDelete: "cascade" }),
  questionId: serial("question_id").notNull(),
  selectedOptions: integer("selected_options").array(),
  textAnswer: text("text_answer"),
  isCorrect: boolean("is_correct"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const answersRelations = relations(answers, ({ one }) => ({
  attempt: one(attempts, { fields: [answers.attemptId], references: [attempts.id] }),
  question: one(questions, { fields: [answers.questionId], references: [questions.id] }),
}));
