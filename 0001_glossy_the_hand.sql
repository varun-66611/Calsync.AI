CREATE TABLE `stripe_invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`stripe_invoice_id` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'usd',
	`status` enum('draft','open','paid','void','uncollectible') NOT NULL,
	`paid_at` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stripe_invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `stripe_invoices_stripe_invoice_id_unique` UNIQUE(`stripe_invoice_id`)
);
--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`stripe_price_id` varchar(255) NOT NULL,
	`stripe_product_id` varchar(255) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`billing_interval` enum('month','year') NOT NULL,
	`features` text,
	`description` text,
	`is_active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscription_plans_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscription_plans_stripe_price_id_unique` UNIQUE(`stripe_price_id`)
);
--> statement-breakpoint
CREATE TABLE `user_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`stripe_customer_id` varchar(255) NOT NULL,
	`stripe_subscription_id` varchar(255) NOT NULL,
	`plan_id` int NOT NULL,
	`status` enum('active','past_due','canceled','unpaid','trialing') NOT NULL,
	`current_period_start` timestamp,
	`current_period_end` timestamp,
	`canceled_at` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_subscriptions_stripe_customer_id_unique` UNIQUE(`stripe_customer_id`),
	CONSTRAINT `user_subscriptions_stripe_subscription_id_unique` UNIQUE(`stripe_subscription_id`)
);
