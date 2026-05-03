CREATE DATABASE railway;

USE railway;

CREATE TABLE users (
    user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (CONCAT(first_name, ' ', last_name)) STORED,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    birth_date DATE,
    national_id VARCHAR(50) UNIQUE,
    passport_number VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'passenger',
    city VARCHAR(100),
    street VARCHAR(150),
    building VARCHAR(50),
    address VARCHAR(400) GENERATED ALWAYS AS (CONCAT_WS(', ', building, street, city)) STORED,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE train (
    train_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    train_number VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    driver_name VARCHAR(200),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (train_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE carriage (
    carriage_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    train_id INT UNSIGNED NOT NULL,
    carriage_number VARCHAR(20) NOT NULL,
    capacity SMALLINT UNSIGNED NOT NULL DEFAULT 50,
    class VARCHAR(30) NOT NULL DEFAULT 'economy',
    PRIMARY KEY (carriage_id),
    UNIQUE KEY uq_carriage_train (train_id, carriage_number),
    FOREIGN KEY (train_id) REFERENCES train(train_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE seat (
    seat_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    carriage_id INT UNSIGNED NOT NULL,
    seat_type VARCHAR(30) NOT NULL,
    seat_number VARCHAR(50) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    PRIMARY KEY (seat_id),
    FOREIGN KEY (carriage_id) REFERENCES carriage(carriage_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_seat_carriage (carriage_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE station (
	station_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    station_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) ,
    PRIMARY KEY (station_id)
);

CREATE TABLE route (
	route_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    route_name VARCHAR(100) NOT NULL,
    origin_station_id INT UNSIGNED NOT NULL,
    destination_station_id INT UNSIGNED NOT NULL,
    distance_km DECIMAL,
    FOREIGN KEY (origin_station_id) REFERENCES station (station_id) ON UPDATE CASCADE,
    FOREIGN KEY (destination_station_id) REFERENCES station (station_id) ON UPDATE CASCADE,
    PRIMARY KEY (route_id)
);

CREATE TABLE journey_instance (
    journey_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    train_id INT UNSIGNED NOT NULL,
    route_id INT UNSIGNED NOT NULL,
    departure_date_time DATETIME NOT NULL,
    arrival_date_time DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    PRIMARY KEY (journey_id),
    FOREIGN KEY (train_id) REFERENCES train(train_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY (route_id) REFERENCES route (route_id) ON UPDATE CASCADE,
    INDEX idx_journey_train (train_id),
    INDEX idx_journey_departure (departure_date_time),
    CHECK (arrival_date_time > departure_date_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE booking (
    booking_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_transaction_id VARCHAR(150),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    PRIMARY KEY (booking_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_booking_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ticket (
    ticket_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    booking_id INT UNSIGNED NOT NULL,
    journey_id INT UNSIGNED NOT NULL,
    seat_id INT UNSIGNED NOT NULL,
    passenger_name VARCHAR(200) NOT NULL,
    passenger_national_id VARCHAR(50) NOT NULL UNIQUE,
    price_paid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'valid',
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (journey_id) REFERENCES journey_instance(journey_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seat(seat_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY uq_seat_journey (seat_id, journey_id),
    INDEX idx_ticket_booking (booking_id),
    INDEX idx_ticket_journey (journey_id),
    INDEX idx_ticket_seat (seat_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
