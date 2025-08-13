# Payment & Enrollment System Integration Guide

## ⚠️ Important Note: Frontend Authentication Updated

**The frontend now properly uses Clerk authentication for all payment API calls.** The payment services have been updated to accept authentication tokens as parameters, and all hooks now get the Clerk token and pass it to the backend.

### Key Changes Made:

- **Removed mock Next.js API routes** - All payment operations now call the NestJS backend directly
- **Updated authentication** - Payment services now accept Clerk tokens as parameters
- **Fixed token handling** - All hooks now get tokens from Clerk and pass them to services
- **Simplified architecture** - Frontend → NestJS Backend → Stripe API

### Frontend Integration:

The frontend services in `features/payments/services/paymentService.ts` are configured to call your NestJS backend endpoints directly. Update the `API_BASE_URL` environment variable to point to your NestJS server.

## Overview

This document provides comprehensive integration guidelines for implementing the payment and enrollment system with a NestJS backend. The system includes Stripe payment processing, coupon management, enrollment tracking, and secure payment flows.

## 🏗️ Architecture

```
Frontend (Next.js) ←→ NestJS Backend ←→ Stripe API
                              ↓
                        PostgreSQL Database
```

**Note:** The frontend communicates directly with the NestJS backend. No Next.js API routes are used for payment operations.

## 📋 Prerequisites

### Frontend Dependencies

```bash
npm install zustand @stripe/stripe-js sonner @clerk/nextjs
```

### Backend Dependencies (NestJS)

```bash
npm install @nestjs/stripe stripe @nestjs/typeorm typeorm pg
npm install @nestjs/config @nestjs/jwt bcryptjs
npm install class-validator class-transformer
```

### Environment Variables

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
CLERK_SECRET_KEY=sk_test_...
```

#### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/elearning"

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# JWT (for Clerk token validation)
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🗄️ Database Schema

### Core Payment Tables

```sql
-- Payment Sessions
CREATE TABLE payment_sessions (
  id VARCHAR(255) PRIMARY KEY,
  course_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  amount INTEGER NOT NULL, -- Amount in cents
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  payment_intent_id VARCHAR(255) UNIQUE,
  enrollment_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  coupon_code VARCHAR(100),
  discount_amount INTEGER DEFAULT 0,
  final_amount INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,

  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL
);

-- Coupons
CREATE TABLE coupons (
  id VARCHAR(255) PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL DEFAULT 'PERCENTAGE',
  discount_value DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  minimum_amount INTEGER,
  maximum_discount INTEGER,
  applicable_courses TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments
CREATE TABLE enrollments (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  course_id VARCHAR(255) NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  progress DECIMAL(5,2) DEFAULT 0,
  current_lecture_id VARCHAR(255),
  enrollment_source VARCHAR(50) DEFAULT 'DIRECT',
  completed_lectures INTEGER DEFAULT 0,
  total_lectures INTEGER DEFAULT 0,
  payment_status VARCHAR(50) DEFAULT 'FREE',
  payment_id VARCHAR(255),
  amount_paid INTEGER,
  discount_applied INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP,
  certificate_earned BOOLEAN DEFAULT false,
  certificate_earned_at TIMESTAMP,
  type VARCHAR(50) DEFAULT 'FREE',
  source VARCHAR(50) DEFAULT 'DIRECT',
  amount INTEGER DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  paid_at TIMESTAMP,
  expires_at TIMESTAMP,
  notes TEXT,
  completion_percentage DECIMAL(5,2) DEFAULT 0,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE(user_id, course_id)
);

-- Payment Methods
CREATE TABLE payment_methods (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  stripe_payment_method_id VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  card_brand VARCHAR(50),
  card_last4 VARCHAR(4),
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  billing_details JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Refunds
CREATE TABLE refunds (
  id VARCHAR(255) PRIMARY KEY,
  payment_session_id VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  reason TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  stripe_refund_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (payment_session_id) REFERENCES payment_sessions(id) ON DELETE CASCADE
);
```

## 🔧 NestJS Backend Implementation

### 1. Payment Module Structure

```
src/
├── payment/
│   ├── payment.module.ts
│   ├── payment.controller.ts
│   ├── payment.service.ts
│   ├── entities/
│   │   ├── payment-session.entity.ts
│   │   ├── coupon.entity.ts
│   │   ├── enrollment.entity.ts
│   │   ├── payment-method.entity.ts
│   │   └── refund.entity.ts
│   ├── dto/
│   │   ├── create-payment-session.dto.ts
│   │   ├── validate-coupon.dto.ts
│   │   ├── create-enrollment.dto.ts
│   │   └── create-refund.dto.ts
│   └── interfaces/
│       ├── stripe.interface.ts
│       └── payment.interface.ts
```

### 2. Authentication Guard (Clerk Integration)

```typescript
// src/auth/guards/clerk-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { verifyToken } from "@clerk/backend";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      const payload = await verifyToken(token, {
        secretKey: this.configService.get("CLERK_SECRET_KEY"),
      });

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
```

### 3. Payment Session Entity

```typescript
// src/payment/entities/payment-session.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Course } from "../../courses/entities/course.entity";

export enum PaymentSessionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
}

@Entity("payment_sessions")
export class PaymentSession {
  @PrimaryColumn()
  id: string;

  @Column()
  courseId: string;

  @Column()
  userId: string;

  @Column({
    type: "enum",
    enum: PaymentSessionStatus,
    default: PaymentSessionStatus.PENDING,
  })
  status: PaymentSessionStatus;

  @Column()
  amount: number; // Amount in cents

  @Column({ length: 3, default: "USD" })
  currency: string;

  @Column({ nullable: true })
  paymentIntentId?: string;

  @Column({ nullable: true })
  enrollmentId?: string;

  @Column({ type: "jsonb", default: {} })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  stripeSessionId?: string;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Column({ nullable: true })
  couponCode?: string;

  @Column({ default: 0 })
  discountAmount: number;

  @Column()
  finalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Course, { onDelete: "CASCADE" })
  @JoinColumn({ name: "course_id" })
  course: Course;
}
```

### 3. DTOs (Data Transfer Objects)

```typescript
// src/payment/dto/create-payment-session.dto.ts
import { IsString, IsOptional, IsObject } from "class-validator";

export class CreatePaymentSessionDto {
  @IsString()
  courseId: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  returnUrl?: string;

  @IsOptional()
  @IsString()
  cancelUrl?: string;
}
```

```typescript
// src/payment/dto/validate-coupon.dto.ts
import { IsString, IsNumber } from "class-validator";

export class ValidateCouponDto {
  @IsString()
  code: string;

  @IsString()
  courseId: string;

  @IsNumber()
  amount: number; // Amount in cents
}
```

```typescript
// src/payment/dto/create-enrollment.dto.ts
import { IsString, IsOptional } from "class-validator";

export class CreateEnrollmentDto {
  @IsString()
  courseId: string;

  @IsOptional()
  @IsString()
  paymentSessionId?: string;
}
```

### 4. Payment Service

```typescript
// src/payment/payment.service.ts
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Stripe from "stripe";
import { PaymentSession } from "./entities/payment-session.entity";
import { CreatePaymentSessionDto } from "./dto/create-payment-session.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(PaymentSession)
    private paymentSessionRepository: Repository<PaymentSession>,
    private configService: ConfigService
  ) {
    this.stripe = new Stripe(this.configService.get("STRIPE_SECRET_KEY"), {
      apiVersion: "2023-10-16",
    });
  }

  async createPaymentSession(dto: CreatePaymentSessionDto, userId: string) {
    try {
      // Get course details
      const course = await this.getCourseById(dto.courseId);
      if (!course) {
        throw new Error("Course not found");
      }

      // Calculate amount and apply coupon
      let amount = course.price;
      let discountAmount = 0;

      if (dto.couponCode) {
        const couponValidation = await this.validateCoupon(
          dto.couponCode,
          dto.courseId,
          amount
        );
        if (couponValidation.isValid) {
          discountAmount = couponValidation.discountAmount;
          amount = couponValidation.finalAmount;
        }
      }

      // Create Stripe Checkout Session
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: course.currency.toLowerCase(),
              product_data: {
                name: course.title,
                description: course.shortDescription,
                images: course.thumbnail ? [course.thumbnail] : [],
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${this.configService.get(
          "FRONTEND_URL"
        )}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get("FRONTEND_URL")}/payment/cancel`,
        metadata: {
          courseId: dto.courseId,
          userId,
          couponCode: dto.couponCode,
        },
      });

      // Create payment session record
      const paymentSession = this.paymentSessionRepository.create({
        id: `ps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        courseId: dto.courseId,
        userId,
        status: "PENDING",
        amount: course.price,
        currency: course.currency,
        discountAmount,
        finalAmount: amount,
        couponCode: dto.couponCode,
        stripeSessionId: session.id,
        metadata: dto.metadata || {},
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      });

      await this.paymentSessionRepository.save(paymentSession);

      return {
        success: true,
        session: paymentSession,
        redirectUrl: session.url,
      };
    } catch (error) {
      this.logger.error("Error creating payment session:", error);
      throw error;
    }
  }

  // 🔧 CRITICAL: This method fixes the infinite loop issue
  async getPaymentSession(stripeSessionId: string, userId: string) {
    try {
      this.logger.debug(
        `Looking for payment session with stripeSessionId: ${stripeSessionId} and userId: ${userId}`
      );

      const paymentSession = await this.paymentSessionRepository.findOne({
        where: {
          stripeSessionId: stripeSessionId,
          userId: userId,
        },
        relations: ["course", "user"],
      });

      if (!paymentSession) {
        this.logger.warn(
          `Payment session not found for stripeSessionId: ${stripeSessionId} and userId: ${userId}`
        );
        throw new NotFoundException("Payment session not found");
      }

      this.logger.debug(
        `Found payment session: ${paymentSession.id} with status: ${paymentSession.status}`
      );

      return {
        success: true,
        session: paymentSession,
      };
    } catch (error) {
      this.logger.error("Error getting payment session:", error);
      throw error;
    }
  }

  // Alternative method to get by internal session ID
  async getPaymentSessionById(sessionId: string, userId: string) {
    try {
      const paymentSession = await this.paymentSessionRepository.findOne({
        where: {
          id: sessionId,
          userId: userId,
        },
        relations: ["course", "user"],
      });

      if (!paymentSession) {
        throw new NotFoundException("Payment session not found");
      }

      return {
        success: true,
        session: paymentSession,
      };
    } catch (error) {
      this.logger.error("Error getting payment session by ID:", error);
      throw error;
    }
  }

  async validateCoupon(code: string, courseId: string, amount: number) {
    try {
      // Implement coupon validation logic here
      // This is a placeholder - implement based on your coupon entity
      const coupon = await this.getCouponByCode(code);

      if (!coupon || !coupon.isActive) {
        return { isValid: false, message: "Invalid or inactive coupon" };
      }

      // Check if coupon is applicable to this course
      if (
        coupon.applicableCourses &&
        !coupon.applicableCourses.includes(courseId)
      ) {
        return {
          isValid: false,
          message: "Coupon not applicable to this course",
        };
      }

      // Check minimum amount
      if (coupon.minimumAmount && amount < coupon.minimumAmount) {
        return {
          isValid: false,
          message: `Minimum amount required: $${coupon.minimumAmount / 100}`,
        };
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = Math.round((amount * coupon.discountValue) / 100);
        if (coupon.maximumDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      const finalAmount = Math.max(0, amount - discountAmount);

      return {
        isValid: true,
        discountAmount,
        finalAmount,
        coupon: {
          code: coupon.code,
          name: coupon.name,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        },
      };
    } catch (error) {
      this.logger.error("Error validating coupon:", error);
      return { isValid: false, message: "Error validating coupon" };
    }
  }

  async createEnrollment(
    courseId: string,
    userId: string,
    paymentSessionId?: string
  ) {
    try {
      // Check if user is already enrolled
      const existingEnrollment = await this.getEnrollmentByUserAndCourse(
        userId,
        courseId
      );
      if (existingEnrollment) {
        this.logger.warn(
          `User ${userId} is already enrolled in course ${courseId}`
        );
        return existingEnrollment;
      }

      // Create enrollment
      const enrollment = this.enrollmentRepository.create({
        id: `enr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        courseId,
        status: "ACTIVE",
        enrollmentSource: paymentSessionId ? "PAID" : "FREE",
        paymentStatus: paymentSessionId ? "PAID" : "FREE",
        paymentId: paymentSessionId,
        enrolledAt: new Date(),
      });

      await this.enrollmentRepository.save(enrollment);

      // Update payment session with enrollment ID if provided
      if (paymentSessionId) {
        await this.paymentSessionRepository.update(
          { id: paymentSessionId },
          { enrollmentId: enrollment.id }
        );
      }

      return enrollment;
    } catch (error) {
      this.logger.error("Error creating enrollment:", error);
      throw error;
    }
  }

  async handleWebhook(event: Stripe.Event) {
    try {
      switch (event.type) {
        case "checkout.session.completed":
          await this.handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session
          );
          break;
        case "payment_intent.succeeded":
          await this.handlePaymentIntentSucceeded(
            event.data.object as Stripe.PaymentIntent
          );
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentIntentFailed(
            event.data.object as Stripe.PaymentIntent
          );
          break;
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error("Error handling webhook:", error);
      throw error;
    }
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ) {
    const paymentSession = await this.paymentSessionRepository.findOne({
      where: { stripeSessionId: session.id },
    });

    if (paymentSession) {
      paymentSession.status = "COMPLETED";
      paymentSession.paymentIntentId = session.payment_intent as string;
      await this.paymentSessionRepository.save(paymentSession);

      // Create enrollment
      await this.createEnrollment(
        paymentSession.courseId,
        paymentSession.userId,
        paymentSession.id
      );
    }
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ) {
    const paymentSession = await this.paymentSessionRepository.findOne({
      where: { paymentIntentId: paymentIntent.id },
    });

    if (paymentSession) {
      paymentSession.status = "COMPLETED";
      await this.paymentSessionRepository.save(paymentSession);
    }
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const paymentSession = await this.paymentSessionRepository.findOne({
      where: { paymentIntentId: paymentIntent.id },
    });

    if (paymentSession) {
      paymentSession.status = "FAILED";
      await this.paymentSessionRepository.save(paymentSession);
    }
  }

  // Helper methods (implement these based on your existing services)
  private async getCourseById(courseId: string) {
    // Implement based on your course service
    // This should return course details including price, currency, etc.
    return null; // Placeholder
  }

  private async getCouponByCode(code: string) {
    // Implement based on your coupon entity
    return null; // Placeholder
  }

  private async getEnrollmentByUserAndCourse(userId: string, courseId: string) {
    // Implement based on your enrollment entity
    return null; // Placeholder
  }

  // Additional methods...
}
```

### 5. Payment Controller

```typescript
// src/payment/payment.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentSessionDto } from "./dto/create-payment-session.dto";
import { ValidateCouponDto } from "./dto/validate-coupon.dto";
import { ClerkAuthGuard } from "../auth/guards/clerk-auth.guard";
import { Request } from "express";

@Controller("api/payments")
@UseGuards(ClerkAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("sessions")
  async createPaymentSession(
    @Body() dto: CreatePaymentSessionDto,
    @Req() req: Request
  ) {
    const userId = req.user["sub"]; // Clerk user ID
    return this.paymentService.createPaymentSession(dto, userId);
  }

  // 🔧 CRITICAL: This endpoint fixes the infinite loop issue
  @Get("sessions/stripe/:stripeSessionId")
  async getPaymentSessionByStripeId(
    @Param("stripeSessionId") stripeSessionId: string,
    @Req() req: Request
  ) {
    const userId = req.user["sub"];
    return this.paymentService.getPaymentSession(stripeSessionId, userId);
  }

  @Get("sessions/:id")
  async getPaymentSessionById(@Param("id") id: string, @Req() req: Request) {
    const userId = req.user["sub"];
    return this.paymentService.getPaymentSessionById(id, userId);
  }

  @Post("coupons/validate")
  async validateCoupon(@Body() dto: ValidateCouponDto, @Req() req: Request) {
    const userId = req.user["sub"];
    return this.paymentService.validateCoupon(
      dto.code,
      dto.courseId,
      dto.amount
    );
  }

  @Post("webhooks/stripe")
  async handleStripeWebhook(@Req() req: Request) {
    const signature = req.headers["stripe-signature"] as string;
    const event = this.paymentService.constructWebhookEvent(
      req.body,
      signature
    );
    return this.paymentService.handleWebhook(event);
  }
}
```

## 🔄 API Routes

### Payment Sessions

| Method | Endpoint                            | Description            |
| ------ | ----------------------------------- | ---------------------- |
| POST   | `/api/payments/sessions`            | Create payment session |
| GET    | `/api/payments/sessions/:id`        | Get payment session    |
| PATCH  | `/api/payments/sessions/:id`        | Update payment session |
| POST   | `/api/payments/sessions/:id/cancel` | Cancel payment session |

### Coupons

| Method | Endpoint                         | Description          |
| ------ | -------------------------------- | -------------------- |
| POST   | `/api/payments/coupons/validate` | Validate coupon code |
| GET    | `/api/payments/coupons/:code`    | Get coupon details   |
| GET    | `/api/payments/coupons/active`   | Get active coupons   |

### Enrollments

| Method | Endpoint                            | Description              |
| ------ | ----------------------------------- | ------------------------ |
| POST   | `/api/enrollments`                  | Create enrollment        |
| GET    | `/api/enrollments`                  | Get user enrollments     |
| GET    | `/api/enrollments/course/:courseId` | Get enrollment by course |
| PATCH  | `/api/enrollments/:id`              | Update enrollment        |
| POST   | `/api/enrollments/:id/cancel`       | Cancel enrollment        |

### Payment Methods

| Method | Endpoint                            | Description                |
| ------ | ----------------------------------- | -------------------------- |
| GET    | `/api/payments/methods`             | Get user payment methods   |
| POST   | `/api/payments/methods`             | Add payment method         |
| DELETE | `/api/payments/methods/:id`         | Remove payment method      |
| POST   | `/api/payments/methods/:id/default` | Set default payment method |

## 🔐 Security Considerations

### 1. Authentication & Authorization

- Use Clerk JWT tokens for API authentication
- Implement role-based access control
- Validate user ownership of resources
- Verify Clerk tokens on every request

### 2. Payment Security

- Never store sensitive payment data
- Use Stripe's secure payment methods
- Implement webhook signature verification
- Use HTTPS for all payment communications

### 3. Data Validation

- Validate all input data using DTOs
- Sanitize user inputs
- Implement rate limiting
- Use parameterized queries

### 4. Error Handling

- Don't expose sensitive information in errors
- Log errors securely
- Implement proper error responses

## 🧪 Testing

### Unit Tests

```typescript
// src/payment/payment.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "./payment.service";

describe("PaymentService", () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it("should create payment session", async () => {
    const dto = {
      courseId: "course_123",
      couponCode: "WELCOME10",
    };

    const result = await service.createPaymentSession(dto, "user_123");
    expect(result.success).toBe(true);
    expect(result.session).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// test/payment.e2e-spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Payment (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/api/payments/sessions (POST)", () => {
    return request(app.getHttpServer())
      .post("/api/payments/sessions")
      .send({
        courseId: "course_123",
        couponCode: "WELCOME10",
      })
      .expect(201);
  });
});
```

## 🚀 Deployment

### 1. Environment Setup

```bash
# Production environment variables
DATABASE_URL="postgresql://user:password@host:5432/elearning"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLERK_SECRET_KEY="sk_live_..."
JWT_SECRET="your-production-jwt-secret"
NODE_ENV="production"
```

### 2. Database Migration

```bash
# Run migrations
npm run migration:run

# Seed initial data
npm run seed
```

### 3. Stripe Webhook Setup

```bash
# Set webhook endpoint
stripe listen --forward-to your-domain.com/api/payments/webhooks/stripe
```

### 4. SSL Certificate

- Ensure HTTPS is enabled
- Configure SSL certificates
- Set up proper CORS policies

## 📊 Monitoring & Analytics

### 1. Payment Analytics

- Track conversion rates
- Monitor payment failures
- Analyze coupon usage
- Revenue reporting

### 2. Error Monitoring

- Implement error tracking (Sentry)
- Monitor webhook failures
- Track API response times
- Alert on critical failures

### 3. Security Monitoring

- Monitor for suspicious activities
- Track failed authentication attempts
- Monitor payment anomalies
- Regular security audits

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Failures**

   - Verify Clerk token is being sent correctly
   - Check Clerk secret key configuration
   - Ensure token is not expired

2. **Webhook Failures**

   - Verify webhook endpoint URL
   - Check webhook signature
   - Ensure proper error handling

3. **Payment Session Expiry**

   - Implement session cleanup
   - Handle expired sessions gracefully
   - Provide clear user feedback

4. **Coupon Validation Issues**

   - Check coupon validity dates
   - Verify usage limits
   - Validate minimum amounts

5. **Database Connection Issues**
   - Check connection pool settings
   - Monitor database performance
   - Implement connection retry logic

### 🔧 Critical Fix: Infinite Loop on Payment Success Page

**Problem**: Users experience an infinite loop and "payment session not found" error when redirected to `/payment/success?session_id=...` after a Stripe payment.

**Root Cause**: The frontend was trying to fetch payment sessions using the internal session ID instead of the Stripe session ID, and the backend was missing the proper endpoint to query by `stripeSessionId`.

**Solution Implemented**:

1. **Backend Fix**: Added `getPaymentSession(stripeSessionId: string, userId: string)` method in `PaymentService`
2. **Backend Fix**: Added `/api/payments/sessions/stripe/:stripeSessionId` endpoint in `PaymentController`
3. **Frontend Fix**: Added `getSessionByStripeId()` method in `paymentSessionService`
4. **Frontend Fix**: Updated `/payment/success` page to use the correct method

### 🔧 Fix: "property successUrl should not exist" Error

**Problem**: Backend returns 400 error with "property successUrl should not exist" when creating payment sessions.

**Root Cause**: The frontend was sending `successUrl` and `cancelUrl` properties, but the backend's `CreatePaymentSessionDto` expects `returnUrl` and `cancelUrl`.

**Solution Implemented**:

1. **Frontend Fix**: Updated `CreatePaymentSessionRequest` interface to use `returnUrl` and `cancelUrl` instead of `successUrl` and `cancelUrl`
2. **Frontend Fix**: Updated `paymentSessionService.createSession()` to correctly handle the new property names
3. **Frontend Fix**: Updated checkout page to include proper `returnUrl` and `cancelUrl` values
4. **Backend Fix**: Confirmed `CreatePaymentSessionDto` includes `returnUrl` and `cancelUrl` properties

**Key Changes**:

```typescript
// Frontend: types/paymentTypes.ts
export interface CreatePaymentSessionRequest {
  courseId: string;
  userId?: string;
  couponCode?: string;
  metadata?: Record<string, any>;
  returnUrl?: string; // Matches backend CreatePaymentSessionDto
  cancelUrl?: string; // Matches backend CreatePaymentSessionDto
}

// Frontend: paymentService.ts
async createSession(request: CreatePaymentSessionRequest, token?: string) {
  const { userId, ...requestBody } = request; // No longer destructuring successUrl/cancelUrl
  const response = await fetch(`${API_BASE_URL}/payments/sessions`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(requestBody), // Includes returnUrl and cancelUrl
  });
}

// Frontend: checkout/page.tsx
const session = await createSession({
  courseId: firstCourse.courseId,
  couponCode: appliedCoupon?.code,
  returnUrl: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${frontendUrl}/payment/cancel`,
  metadata: {
    totalAmount: total,
    itemCount: checkoutItems.length,
  },
});

// Backend: CreatePaymentSessionDto
export class CreatePaymentSessionDto {
  @IsString()
  courseId: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  returnUrl?: string;

  @IsOptional()
  @IsString()
  cancelUrl?: string;
}

// Backend: PaymentService
async createPaymentSession(dto: CreatePaymentSessionDto, userId: string) {
  const session = await this.stripe.checkout.sessions.create({
    // ... other properties
    success_url: dto.returnUrl || `${this.configService.get('FRONTEND_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: dto.cancelUrl || `${this.configService.get('FRONTEND_URL')}/payment/cancel`,
  });
}
```

**Environment Variables Required**:

Add to your backend `.env` file:

```env
FRONTEND_URL=http://localhost:3000
```

Add to your frontend `.env.local` file:

```env
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

**Verification Steps**:

1. Ensure both `FRONTEND_URL` and `NEXT_PUBLIC_FRONTEND_URL` are set in your environment files
2. Verify the backend DTO includes `returnUrl` and `cancelUrl` properties
3. Test payment session creation with the correct property names
4. Confirm Stripe redirects work correctly after payment

**Key Changes**:

```typescript
// Backend: PaymentService
async getPaymentSession(stripeSessionId: string, userId: string) {
  const paymentSession = await this.paymentSessionRepository.findOne({
    where: {
      stripeSessionId: stripeSessionId,
      userId: userId
    },
    relations: ['course', 'user']
  });
  // ... error handling
}

// Backend: PaymentController
@Get("sessions/stripe/:stripeSessionId")
async getPaymentSessionByStripeId(
  @Param("stripeSessionId") stripeSessionId: string,
  @Req() req: Request
) {
  const userId = req.user["sub"];
  return this.paymentService.getPaymentSession(stripeSessionId, userId);
}

// Frontend: paymentService.ts
async getSessionByStripeId(stripeSessionId: string, token?: string): Promise<PaymentSession | null> {
  const response = await fetch(`${API_BASE_URL}/payments/sessions/stripe/${stripeSessionId}`, {
    headers: getAuthHeaders(token),
  });
  // ... error handling
}

// Frontend: payment/success/page.tsx
const session = await paymentSessionService.getSessionByStripeId(sessionIdParam, await clerkUser?.getToken());
```

**Verification Steps**:

1. Ensure the backend implements the `getPaymentSession` method correctly
2. Verify the endpoint `/api/payments/sessions/stripe/:stripeSessionId` is accessible
3. Test the complete payment flow from course selection to success page
4. Check that the payment session is found and enrollment is created successfully

### Debug Mode

```typescript
// Enable debug logging
const debugMode = process.env.NODE_ENV === "development";

if (debugMode) {
  this.logger.debug("Payment session created:", session);
}
```

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Support

For integration support:

1. Check the troubleshooting section
2. Review error logs
3. Test with Stripe test mode
4. Contact the development team

---

**Note**: This is a comprehensive implementation guide. Adapt the code according to your specific requirements and security policies.
