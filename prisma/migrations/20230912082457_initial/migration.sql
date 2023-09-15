-- CreateTable
CREATE TABLE `billing_click` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `click_trans_id` INTEGER NULL,
    `service_id` INTEGER NULL,
    `merchant_trans_id` VARCHAR(255) NULL,
    `amount` VARCHAR(255) NULL,
    `action` INTEGER NULL,
    `error` INTEGER NULL,
    `error_note` VARCHAR(255) NULL,
    `sign_time` VARCHAR(255) NULL,
    `sight_string` VARCHAR(255) NULL,
    `merchant_confirm_id` VARCHAR(255) NULL,
    `click_paydoc_id` INTEGER NULL,
    `merchant_cancel` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `billing_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(15) NOT NULL,
    `created` INTEGER NULL,
    `create_time` VARCHAR(50) NULL,
    `perform_time` VARCHAR(50) NULL,
    `payed_date` INTEGER NULL,
    `cancel_time` VARCHAR(55) NULL,
    `status` INTEGER NULL,
    `summ` INTEGER NULL,
    `info_billing` VARCHAR(255) NULL,
    `invoice_id` INTEGER NULL,
    `fio` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `hotel_id` INTEGER NULL,
    `start_date` DATETIME(0) NULL,
    `admin` VARCHAR(255) NULL,
    `end_date` DATETIME(0) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `adults` INTEGER NULL,
    `children` INTEGER NULL,
    `rooms` INTEGER NULL,
    `room_type` VARCHAR(255) NULL,
    `status` VARCHAR(255) NULL DEFAULT 'CHECKIN',
    `amount` VARCHAR(255) NULL,
    `pay_type` INTEGER NULL,
    `notes` TEXT NULL,
    `paid` VARCHAR(255) NULL,
    `debt` VARCHAR(255) NULL,
    `persons` VARCHAR(255) NULL,
    `country` VARCHAR(255) NULL,
    `agent` VARCHAR(255) NULL,
    `tariff_plan_id` VARCHAR(20) NULL,
    `discount` DECIMAL(65, 30) NULL,
    `payment_type` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comfortables` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title_ru` VARCHAR(255) NULL,
    `title_uz` VARCHAR(255) NULL,
    `title_en` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `hotel_id` INTEGER NULL,
    `comment` TEXT NULL,
    `type` VARCHAR(255) NULL,

    UNIQUE INDEX `id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `corp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `region_id` INTEGER NULL,
    `parent_id` INTEGER NULL,
    `title` VARCHAR(255) NULL,
    `code` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hotels` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title_ru` VARCHAR(255) NULL,
    `title_uz` VARCHAR(255) NULL,
    `info_ru` VARCHAR(255) NULL,
    `info_uz` VARCHAR(255) NULL,
    `comfortables` VARCHAR(255) NULL,
    `region_id` INTEGER NULL,
    `address` VARCHAR(255) NULL,
    `rating` INTEGER NULL,
    `info_en` VARCHAR(255) NULL,
    `title_en` VARCHAR(255) NULL,
    `photos_url` VARCHAR(255) NULL,
    `latitude` VARCHAR(255) NULL,
    `longitude` VARCHAR(255) NULL,
    `main_photo` VARCHAR(255) NULL,
    `comments_url` VARCHAR(255) NULL,
    `active` BOOLEAN NULL,
    `photos_room` VARCHAR(255) NULL,
    `photos_reception` VARCHAR(255) NULL,
    `photos_front` VARCHAR(255) NULL,
    `photos_bathroom` VARCHAR(255) NULL,
    `photos_breakfast` VARCHAR(255) NULL,
    `photos_other` VARCHAR(255) NULL,
    `username` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `auth_key` VARCHAR(255) NULL,
    `password_hash` VARCHAR(255) NULL,
    `status` SMALLINT NULL,
    `email` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `single` INTEGER NULL,
    `double` INTEGER NULL,
    `triple` INTEGER NULL,
    `family` INTEGER NULL,
    `deluxe` INTEGER NULL,
    `twin` INTEGER NULL,
    `role` VARCHAR(255) NULL,
    `contact_number` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pay_trans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pay_id` VARCHAR(25) NOT NULL,
    `pay_time` VARCHAR(13) NOT NULL,
    `perform_time` DATETIME(0) NULL,
    `cancel_time` DATETIME(0) NULL,
    `pay_amount` INTEGER NOT NULL,
    `stat` TINYINT NOT NULL,
    `reason` TINYINT NULL,
    `receivers` VARCHAR(500) NULL,
    `pay_acount` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title_ru` VARCHAR(255) NULL,
    `title_uz` VARCHAR(255) NULL,
    `title_en` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservations` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `hotel_id` INTEGER NULL,
    `start_date` DATETIME(0) NULL,
    `end_date` DATETIME(0) NULL,
    `pay_type` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `adults` INTEGER NULL,
    `children` INTEGER NULL,
    `rooms` VARCHAR(255) NULL,
    `room_type` VARCHAR(255) NULL,
    `status` VARCHAR(255) NULL DEFAULT 'UNPAID',
    `amount` FLOAT NULL,
    `order` INTEGER NULL,
    `done` TINYINT NULL,
    `corp_id` INTEGER NULL,
    `agent` VARCHAR(255) NULL,
    `country` VARCHAR(255) NULL,
    `notes` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `hotel_id` INTEGER NULL,
    `title` VARCHAR(255) NULL,
    `type` VARCHAR(255) NULL,
    `active` BOOLEAN NULL,
    `price` VARCHAR(255) NULL,
    `size` INTEGER NULL,
    `photo` VARCHAR(255) NULL,
    `photo_second` VARCHAR(255) NULL,
    `color` VARCHAR(255) NULL,
    `square` VARCHAR(255) NULL,
    `status` VARCHAR(255) NULL,
    `cleaned` DATETIME(0) NULL,
    `cleaned_type` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `telegram_id` BIGINT NULL,
    `full_name` VARCHAR(255) NULL,
    `phone_number` VARCHAR(255) NULL,
    `lang` VARCHAR(5) NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reception_admins` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255) NULL,
    `hotel_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tariff_plans` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `hotel_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `active` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
