

CREATE DATABASE oral_archive_db;
USE oral_archive_db;


CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (role_name)
VALUES ('reader'), ('contributor'), ('moderator'), ('admin');



CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    region VARCHAR(100),
    profile_picture VARCHAR(255),
    role_id INT NOT NULL,
    archive_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);


CREATE INDEX idx_users_role ON users(role_id);



CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE stories (
    story_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    category_id INT,
    country VARCHAR(100),
    region VARCHAR(100),
    year INT,
 country VARCHAR(100),
    region VARCHAR(100),
    year INT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE INDEX idx_story_user ON stories(user_id);
CREATE INDEX idx_story_category ON stories(category_id);
CREATE INDEX idx_story_status ON stories(status);



CREATE TABLE tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE story_tags (
    story_id INT NOT NULL,
    tag_id INT NOT NULL,

    PRIMARY KEY (story_id, tag_id),
    FOREIGN KEY (story_id) REFERENCES stories(story_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);


CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    story_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (story_id) REFERENCES stories(story_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_comments_story ON comments(story_id);


CREATE TABLE votes (
    vote_id INT AUTO_INCREMENT PRIMARY KEY,
    story_id INT NOT NULL,
    user_id INT NOT NULL,
    vote_value TINYINT NOT NULL,   -- 1 = upvote, -1 = downvote

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (story_id) REFERENCES stories(story_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    UNIQUE (story_id, user_id)  -- Prevent duplicate votes
);


CREATE TABLE story_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    story_id INT NOT NULL,
    user_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending','reviewed','dismissed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (story_id) REFERENCES stories(story_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);




CREATE TABLE competitions (
    competition_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    word_limit INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('upcoming','active','ended') DEFAULT 'upcoming'
);



CREATE TABLE competition_entries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    competition_id INT NOT NULL,
competition_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    word_count INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (competition_id) REFERENCES competitions(competition_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE INDEX idx_entries_competition ON competition_entries(competition_id);



CREATE TABLE competition_ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    entry_id INT NOT NULL,
    user_id INT NOT NULL,
    rating_value TINYINT NOT NULL,   -- e.g., 1–5

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (entry_id) REFERENCES competition_entries(entry_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    UNIQUE (entry_id, user_id) -- one rating per user
);


CREATE TABLE competition_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    competition_id INT NOT NULL,
    user_id INT NOT NULL,
    points_awarded INT NOT NULL,

    FOREIGN KEY (competition_id) REFERENCES competitions(competition_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);



